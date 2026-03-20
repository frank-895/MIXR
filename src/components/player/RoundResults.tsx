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
    <main className="screen center">
      <h2>
        ROUND {game.currentRound} / {game.totalRounds}
      </h2>
      <h1 style={{ fontSize: 36 }}>COMPLETE</h1>

      {caption ? (
        <div className="brutal-card" style={{ padding: 24, width: '100%' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            YOUR CAPTION:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 24,
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            "{caption.text}"
          </p>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 20,
              fontWeight: 700,
              border: '2px solid #000',
              background: 'var(--primary)',
              padding: '4px 12px',
              display: 'inline-block',
              boxShadow: '2px 2px 0px #000',
            }}
          >
            {caption.score} PTS
          </div>
        </div>
      ) : (
        <div className="brutal-card" style={{ padding: 24, width: '100%' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'uppercase' }}>
            YOU DIDN'T SUBMIT A CAPTION THIS ROUND.
          </p>
        </div>
      )}

      <p className="animate-pulse" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
        NEXT ROUND STARTING SOON...
      </p>
    </main>
  )
}
