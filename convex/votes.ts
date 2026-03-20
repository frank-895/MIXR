import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getCandidates = query({
  args: {
    playerId: v.id('players'),
    roundId: v.id('rounds'),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const round = await ctx.db.get(args.roundId)
    if (!round) return []

    // Get all captions for the round
    const allCaptions = await ctx.db
      .query('captions')
      .withIndex('by_roundId', (q) => q.eq('roundId', args.roundId))
      .take(200)

    // Exclude player's own captions
    const otherCaptions = allCaptions.filter((c) => c.userId !== args.playerId)

    // Get all votes by this player
    const playerVotes = await ctx.db
      .query('votes')
      .withIndex('by_userId', (q) => q.eq('userId', args.playerId))
      .take(200)

    const votedCaptionIds = new Set(playerVotes.map((v) => v.captionId))

    // Exclude already-voted captions
    const candidates = otherCaptions.filter((c) => !votedCaptionIds.has(c._id))

    // Shuffle and take requested count
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }

    return candidates.slice(0, args.count).map((c) => ({
      captionId: c._id,
      text: c.text,
    }))
  },
})

export const castVote = mutation({
  args: {
    playerId: v.id('players'),
    captionId: v.id('captions'),
    value: v.boolean(),
  },
  handler: async (ctx, args) => {
    const caption = await ctx.db.get(args.captionId)
    if (!caption) throw new Error('Caption not found')

    const round = await ctx.db.get(caption.roundId)
    if (!round) throw new Error('Round not found')
    if (round.state !== 'vote') throw new Error('Not in vote phase')
    if (Date.now() > round.voteEndsAt) throw new Error('Vote phase ended')

    // Check uniqueness
    const existing = await ctx.db
      .query('votes')
      .withIndex('by_userId_and_captionId', (q) =>
        q.eq('userId', args.playerId).eq('captionId', args.captionId)
      )
      .unique()

    if (existing) throw new Error('Already voted on this caption')

    await ctx.db.insert('votes', {
      userId: args.playerId,
      captionId: args.captionId,
      value: args.value,
    })

    await ctx.db.patch(args.captionId, {
      score: caption.score + (args.value ? 1 : -1),
      exposureCount: caption.exposureCount + 1,
    })
  },
})
