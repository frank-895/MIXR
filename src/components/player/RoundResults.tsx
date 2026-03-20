import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'

export function RoundResults({
  round,
  playerId,
  game,
}: {
  round: Doc<'rounds'>
  playerId: Id<'players'>
  game: { currentRound: number; totalRounds: number }
}) {
  const caption = useQuery(api.captions.getPlayerCaption, {
    playerId,
    roundId: round._id,
  })

  return (
    <div className="screen center">
      <h2>
        Round {game.currentRound} / {game.totalRounds} - Complete
      </h2>

      {caption ? (
        <div className="round-result">
          <p>Your caption:</p>
          <p className="caption-text">"{caption.text}"</p>
          <p className="score">
            Score: <strong>{caption.score}</strong>
          </p>
        </div>
      ) : (
        <p>You didn't submit a caption this round.</p>
      )}

      <p className="hint">Next round starting soon...</p>
    </div>
  )
}
