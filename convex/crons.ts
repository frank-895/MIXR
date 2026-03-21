import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval(
  'cleanup expired games',
  { minutes: 1 },
  internal.internal.gameCleanup.sweepExpiredGames,
  {}
)

export default crons
