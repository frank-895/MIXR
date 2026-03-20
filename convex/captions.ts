import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const submit = mutation({
  args: {
    playerId: v.id('players'),
    roundId: v.id('rounds'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const round = await ctx.db.get(args.roundId)
    if (!round) throw new Error('Round not found')
    if (round.state !== 'caption') throw new Error('Not in caption phase')
    if (Date.now() > round.captionEndsAt) throw new Error('Caption phase ended')

    const trimmed = args.text.trim()
    if (!trimmed) throw new Error('Caption cannot be empty')

    const existing = await ctx.db
      .query('captions')
      .withIndex('by_userId_and_roundId', (q) =>
        q.eq('userId', args.playerId).eq('roundId', args.roundId)
      )
      .unique()

    if (existing) throw new Error('Already submitted a caption')

    return await ctx.db.insert('captions', {
      userId: args.playerId,
      roundId: args.roundId,
      text: trimmed,
      score: 0,
      exposureCount: 0,
    })
  },
})

export const listByRound = query({
  args: { roundId: v.id('rounds') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('captions')
      .withIndex('by_roundId', (q) => q.eq('roundId', args.roundId))
      .take(200)
  },
})

export const getPlayerCaption = query({
  args: { playerId: v.id('players'), roundId: v.id('rounds') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('captions')
      .withIndex('by_userId_and_roundId', (q) =>
        q.eq('userId', args.playerId).eq('roundId', args.roundId)
      )
      .unique()
  },
})
