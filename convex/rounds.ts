import { v } from 'convex/values'
import { query } from './_generated/server'

export const getCurrent = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId)
    if (!game) return null

    return await ctx.db
      .query('rounds')
      .withIndex('by_gameId_and_roundNumber', (q) =>
        q.eq('gameId', args.gameId).eq('roundNumber', game.currentRound)
      )
      .unique()
  },
})

export const get = query({
  args: { roundId: v.id('rounds') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roundId)
  },
})
