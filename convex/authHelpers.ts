import { getAuthUserId } from '@convex-dev/auth/server'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'

type AuthenticatedCtx = MutationCtx | QueryCtx

export async function requireAuthUserId(
  ctx: AuthenticatedCtx
): Promise<Id<'users'>> {
  const userId = await getAuthUserId(ctx)
  if (userId === null) {
    throw new Error('NOT AUTHENTICATED')
  }

  return userId
}

export async function requireGameHost(
  ctx: AuthenticatedCtx,
  gameId: Id<'games'>
): Promise<Doc<'games'>> {
  const [userId, game] = await Promise.all([
    requireAuthUserId(ctx),
    ctx.db.get(gameId),
  ])

  if (!game) {
    throw new Error('GAME NOT FOUND')
  }

  if (game.hostUserId !== userId) {
    throw new Error('UNAUTHORIZED')
  }

  return game
}
