import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const join = mutation({
  args: { gameId: v.id('games'), name: v.string() },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId)
    if (!game) throw new Error('Game not found')
    if (game.state !== 'lobby') throw new Error('Game already started')

    const trimmed = args.name.trim()
    if (!trimmed) throw new Error('Name cannot be empty')

    const playerId = await ctx.db.insert('players', {
      gameId: args.gameId,
      name: trimmed,
    })

    return playerId
  },
})

export const listByGame = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('players')
      .withIndex('by_gameId', (q) => q.eq('gameId', args.gameId))
      .take(100)
  },
})

export const getScores = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query('players')
      .withIndex('by_gameId', (q) => q.eq('gameId', args.gameId))
      .take(100)

    const rounds = await ctx.db
      .query('rounds')
      .withIndex('by_gameId_and_roundNumber', (q) =>
        q.eq('gameId', args.gameId)
      )
      .take(10)

    const roundIds = new Set(rounds.map((r) => r._id))

    const scores: { playerId: string; name: string; totalScore: number }[] = []

    for (const player of players) {
      let totalScore = 0
      const captions = await ctx.db
        .query('captions')
        .withIndex('by_userId_and_roundId', (q) => q.eq('userId', player._id))
        .take(10)

      for (const caption of captions) {
        if (roundIds.has(caption.roundId)) {
          totalScore += caption.score
        }
      }

      scores.push({
        playerId: player._id,
        name: player.name,
        totalScore,
      })
    }

    scores.sort((a, b) => b.totalScore - a.totalScore)
    return scores
  },
})
