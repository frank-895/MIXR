import {
  GAME_RETENTION_MS,
  REVEAL_PHASE_DURATION_MS,
  STUCK_GAME_GRACE_MS,
} from '../constants'

export function getLobbyExpiresAt(now: number): number {
  return now + GAME_RETENTION_MS
}

export function getCaptionPhaseExpiresAt(
  now: number,
  captionPhaseDurationMs: number
): number {
  return now + captionPhaseDurationMs + STUCK_GAME_GRACE_MS
}

export function getVotePhaseExpiresAt(
  now: number,
  votePhaseDurationMs: number
): number {
  return now + votePhaseDurationMs + STUCK_GAME_GRACE_MS
}

export function getRevealPhaseExpiresAt(now: number): number {
  return now + REVEAL_PHASE_DURATION_MS + STUCK_GAME_GRACE_MS
}

export function getFinishedExpiresAt(finishedAt: number): number {
  return finishedAt + GAME_RETENTION_MS
}
