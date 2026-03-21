import { v } from 'convex/values'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { internalMutation, type MutationCtx } from '../_generated/server'
import { EXPIRED_GAME_SWEEP_BATCH_SIZE } from '../constants'

const CAPTION_BATCH_SIZE = 200
const ROUND_CHILD_BATCH_SIZE = 200
const ROUND_BATCH_SIZE = 20
const VOTE_BATCH_SIZE = 200
const PLAYER_BATCH_SIZE = 100

async function deleteVotesForRound(
  ctx: MutationCtx,
  roundId: Id<'rounds'>
): Promise<'done' | 'needs_more_work'> {
  const votes = await ctx.db
    .query('votes')
    .withIndex('by_roundId', (q) => q.eq('roundId', roundId))
    .take(VOTE_BATCH_SIZE)

  for (const vote of votes) {
    await ctx.db.delete(vote._id)
  }

  return votes.length === VOTE_BATCH_SIZE ? 'needs_more_work' : 'done'
}

async function deleteRoundVoteCandidates(
  ctx: MutationCtx,
  roundId: Id<'rounds'>
): Promise<'done' | 'needs_more_work'> {
  const candidates = await ctx.db
    .query('roundVoteCandidates')
    .withIndex('by_roundId', (q) => q.eq('roundId', roundId))
    .take(ROUND_CHILD_BATCH_SIZE)

  for (const candidate of candidates) {
    await ctx.db.delete(candidate._id)
  }

  return candidates.length === ROUND_CHILD_BATCH_SIZE
    ? 'needs_more_work'
    : 'done'
}

async function deletePlayerRoundState(
  ctx: MutationCtx,
  roundId: Id<'rounds'>
): Promise<'done' | 'needs_more_work'> {
  const playerRoundState = await ctx.db
    .query('playerRoundState')
    .withIndex('by_roundId', (q) => q.eq('roundId', roundId))
    .take(ROUND_CHILD_BATCH_SIZE)

  for (const row of playerRoundState) {
    await ctx.db.delete(row._id)
  }

  return playerRoundState.length === ROUND_CHILD_BATCH_SIZE
    ? 'needs_more_work'
    : 'done'
}

async function deleteCaptionRoundStats(
  ctx: MutationCtx,
  roundId: Id<'rounds'>
): Promise<'done' | 'needs_more_work'> {
  const stats = await ctx.db
    .query('captionRoundStats')
    .withIndex('by_roundId', (q) => q.eq('roundId', roundId))
    .take(ROUND_CHILD_BATCH_SIZE)

  for (const stat of stats) {
    await ctx.db.delete(stat._id)
  }

  return stats.length === ROUND_CHILD_BATCH_SIZE ? 'needs_more_work' : 'done'
}

async function deleteCaptionsForRound(
  ctx: MutationCtx,
  roundId: Id<'rounds'>
): Promise<'done' | 'needs_more_work'> {
  const captions = await ctx.db
    .query('captions')
    .withIndex('by_roundId', (q) => q.eq('roundId', roundId))
    .take(CAPTION_BATCH_SIZE)

  for (const caption of captions) {
    await ctx.db.delete(caption._id)
  }

  return captions.length === CAPTION_BATCH_SIZE ? 'needs_more_work' : 'done'
}

async function cancelRoundJobs(ctx: MutationCtx, roundId: Id<'rounds'>) {
  const round = await ctx.db.get(roundId)
  if (!round) {
    return
  }

  if (round.scheduledEndCaptionJobId) {
    await ctx.scheduler.cancel(round.scheduledEndCaptionJobId)
  }
  if (round.scheduledPrepareVoteArtifactsJobId) {
    await ctx.scheduler.cancel(round.scheduledPrepareVoteArtifactsJobId)
  }
  if (round.scheduledEndVoteJobId) {
    await ctx.scheduler.cancel(round.scheduledEndVoteJobId)
  }
  if (round.scheduledEndRevealJobId) {
    await ctx.scheduler.cancel(round.scheduledEndRevealJobId)
  }
  if (round.scheduledRefreshStatsJobId) {
    await ctx.scheduler.cancel(round.scheduledRefreshStatsJobId)
  }
}

async function cleanupGame(
  ctx: MutationCtx,
  gameId: Id<'games'>
): Promise<'done' | 'needs_more_work'> {
  const rounds = await ctx.db
    .query('rounds')
    .withIndex('by_gameId_and_roundNumber', (q) => q.eq('gameId', gameId))
    .take(ROUND_BATCH_SIZE)

  for (const round of rounds) {
    await cancelRoundJobs(ctx, round._id)

    const cleanupSteps = [
      await deleteRoundVoteCandidates(ctx, round._id),
      await deletePlayerRoundState(ctx, round._id),
      await deleteCaptionRoundStats(ctx, round._id),
      await deleteVotesForRound(ctx, round._id),
      await deleteCaptionsForRound(ctx, round._id),
    ]

    if (cleanupSteps.includes('needs_more_work')) {
      return 'needs_more_work'
    }

    await ctx.db.delete(round._id)
  }

  if (rounds.length === ROUND_BATCH_SIZE) {
    return 'needs_more_work'
  }

  const playerGameStats = await ctx.db
    .query('playerGameStats')
    .withIndex('by_gameId_and_totalScore', (q) => q.eq('gameId', gameId))
    .take(PLAYER_BATCH_SIZE)

  for (const stat of playerGameStats) {
    await ctx.db.delete(stat._id)
  }

  if (playerGameStats.length === PLAYER_BATCH_SIZE) {
    return 'needs_more_work'
  }

  const players = await ctx.db
    .query('players')
    .withIndex('by_gameId', (q) => q.eq('gameId', gameId))
    .take(PLAYER_BATCH_SIZE)

  for (const player of players) {
    await ctx.db.delete(player._id)
  }

  if (players.length === PLAYER_BATCH_SIZE) {
    return 'needs_more_work'
  }

  const game = await ctx.db.get(gameId)
  if (game) {
    await ctx.db.delete(gameId)
  }

  return 'done'
}

export const cleanupExpiredGame = internalMutation({
  args: {
    gameId: v.id('games'),
    expectedExpiresAt: v.number(),
  },
  handler: async (ctx, args): Promise<null> => {
    const game = await ctx.db.get(args.gameId)
    if (!game) {
      return null
    }

    if (game.expiresAt !== args.expectedExpiresAt) {
      return null
    }

    if (Date.now() < game.expiresAt) {
      return null
    }

    const result = await cleanupGame(ctx, args.gameId)
    if (result === 'needs_more_work') {
      await ctx.scheduler.runAfter(
        0,
        internal.internal.gameCleanup.cleanupExpiredGame,
        args
      )
    }

    return null
  },
})

export const sweepExpiredGames = internalMutation({
  args: {},
  handler: async (ctx): Promise<null> => {
    const expiredGames = await ctx.db
      .query('games')
      .withIndex('by_expiresAt', (q) => q.lte('expiresAt', Date.now()))
      .take(EXPIRED_GAME_SWEEP_BATCH_SIZE)

    for (const game of expiredGames) {
      await ctx.scheduler.runAfter(
        0,
        internal.internal.gameCleanup.cleanupExpiredGame,
        {
          gameId: game._id,
          expectedExpiresAt: game.expiresAt,
        }
      )
    }

    return null
  },
})
