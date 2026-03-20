import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const COOLDOWN_MS = 5_000

export const submit = mutation({
  args: {
    playerId: v.id('players'),
    roundId: v.id('rounds'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const round = await ctx.db.get(args.roundId)
    if (!round) throw new Error('Round not found')

    const now = Date.now()

    // Allow captioning during "caption" and "open" phases
    if (round.state === 'caption') {
      if (now > round.captionEndsAt) throw new Error('Caption phase ended')
    } else if (round.state === 'open') {
      if (now > round.voteEndsAt) throw new Error('Round ended')
    } else {
      throw new Error('Not in a captioning phase')
    }

    const trimmed = args.text.trim()
    if (!trimmed) throw new Error('Caption cannot be empty')

    // Enforce 5s cooldown between submissions
    const playerCaptions = await ctx.db
      .query('captions')
      .withIndex('by_userId_and_roundId', (q) =>
        q.eq('userId', args.playerId).eq('roundId', args.roundId)
      )
      .collect()

    if (playerCaptions.length > 0) {
      const latest = playerCaptions.reduce((a, b) =>
        a.createdAt > b.createdAt ? a : b
      )
      if (now - latest.createdAt < COOLDOWN_MS) {
        throw new Error('Please wait before submitting another caption')
      }
    }

    return await ctx.db.insert('captions', {
      userId: args.playerId,
      roundId: args.roundId,
      text: trimmed,
      score: 0,
      exposureCount: 0,
      createdAt: now,
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

export const getPlayerCaptions = query({
  args: { playerId: v.id('players'), roundId: v.id('rounds') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('captions')
      .withIndex('by_userId_and_roundId', (q) =>
        q.eq('userId', args.playerId).eq('roundId', args.roundId)
      )
      .collect()
  },
})
