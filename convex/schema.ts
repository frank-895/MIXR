import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  games: defineTable({
    code: v.string(),
    state: v.string(),
    totalRounds: v.number(),
    currentRound: v.number(),
  }).index('by_code', ['code']),

  players: defineTable({
    gameId: v.id('games'),
    name: v.string(),
  }).index('by_gameId', ['gameId']),

  rounds: defineTable({
    gameId: v.id('games'),
    roundNumber: v.number(),
    imageUrl: v.string(),
    state: v.string(),
    captionEndsAt: v.number(),
    voteEndsAt: v.number(),
  }).index('by_gameId_and_roundNumber', ['gameId', 'roundNumber']),

  captions: defineTable({
    userId: v.id('players'),
    roundId: v.id('rounds'),
    text: v.string(),
    score: v.number(),
    exposureCount: v.number(),
  })
    .index('by_roundId', ['roundId'])
    .index('by_userId_and_roundId', ['userId', 'roundId']),

  votes: defineTable({
    userId: v.id('players'),
    captionId: v.id('captions'),
    value: v.boolean(),
  })
    .index('by_userId_and_captionId', ['userId', 'captionId'])
    .index('by_captionId', ['captionId'])
    .index('by_userId', ['userId']),
})
