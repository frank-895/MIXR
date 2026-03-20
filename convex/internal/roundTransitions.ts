import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { internalMutation } from '../_generated/server'
import { MEME_IMAGES } from '../seed'

export const endCaptionPhase = internalMutation({
  args: { roundId: v.id('rounds') },
  handler: async (ctx, args) => {
    const round = await ctx.db.get(args.roundId)
    if (!round || round.state !== 'caption') return

    const now = Date.now()
    await ctx.db.patch(args.roundId, {
      state: 'open',
      voteEndsAt: now + 90_000,
    })

    await ctx.scheduler.runAfter(
      90_000,
      internal.internal.roundTransitions.endOpenPhase,
      { roundId: args.roundId }
    )
  },
})

export const endOpenPhase = internalMutation({
  args: { roundId: v.id('rounds') },
  handler: async (ctx, args) => {
    const round = await ctx.db.get(args.roundId)
    if (!round || round.state !== 'open') return

    await ctx.db.patch(args.roundId, { state: 'finished' })

    const game = await ctx.db.get(round.gameId)
    if (!game) return

    if (game.currentRound < game.totalRounds) {
      const nextRoundNumber = game.currentRound + 1
      await ctx.db.patch(game._id, { currentRound: nextRoundNumber })

      const imageUrl = MEME_IMAGES[(nextRoundNumber - 1) % MEME_IMAGES.length]
      const now = Date.now()

      const nextRoundId = await ctx.db.insert('rounds', {
        gameId: game._id,
        roundNumber: nextRoundNumber,
        imageUrl,
        state: 'caption',
        captionEndsAt: now + 30_000,
        voteEndsAt: 0,
      })

      await ctx.scheduler.runAfter(
        30_000,
        internal.internal.roundTransitions.endCaptionPhase,
        { roundId: nextRoundId }
      )
    } else {
      await ctx.db.patch(game._id, { state: 'finished' })
    }
  },
})
