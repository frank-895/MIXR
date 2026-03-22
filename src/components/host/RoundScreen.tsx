import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useCountdown } from '../../lib/useCountdown'
import { Loader } from '../Loader'
import { CaptionPhaseOverlay } from './CaptionPhaseOverlay'
import { RevealScreen } from './RevealScreen'
import { VotePhaseGrid } from './VotePhaseGrid'

export function RoundScreen({ game }: { game: Doc<'games'> }) {
  const round = useQuery(api.rounds.getCurrent, { gameId: game._id })
  const captions = useQuery(
    api.captions.listByRound,
    round ? { roundId: round._id } : 'skip'
  )
  const skipPhase = useMutation(api.games.skipPhase)

  if (round?.state === 'reveal') {
    return <RevealScreen round={round} game={game} />
  }

  if (!round) {
    return (
      <div className="host-shell">
        <main className="screen center">
          <Loader />
          <h2>LOADING ROUND...</h2>
        </main>
      </div>
    )
  }

  const targetTime =
    round.state === 'caption' ? round.captionEndsAt : round.voteEndsAt

  return (
    <div className="host-shell">
      {/* Header */}
      <header className="brutal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div className="badge badge--primary">
            {game.currentRound} / {game.totalRounds}
          </div>
          <div
            className="badge"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
            >
              group
            </span>
            {game.activePlayerCount ?? 0}
          </div>
          {round.state !== 'finished' && <Timer targetTime={targetTime} />}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: round.state === 'caption' ? '#000' : 'var(--pink)',
          }}
        >
          {round.state === 'caption' ? (
            <>
              CAPTIONS
              <span className="lobby__player-count" style={{ marginLeft: 12 }}>
                {captions?.length ?? 0}
              </span>
            </>
          ) : round.state === 'vote' ? (
            'VOTING...'
          ) : (
            'ROUND COMPLETE'
          )}
        </div>
        <button
          type="button"
          className="brutal-header-btn"
          style={
            round.state === 'finished' ? { visibility: 'hidden' } : undefined
          }
          onClick={() => skipPhase({ gameId: game._id })}
          aria-label="Skip to next phase"
        >
          <span className="material-symbols-outlined">skip_next</span>
        </button>
      </header>

      {/* Main Content */}
      {round.state === 'caption' ? (
        <CaptionPhaseOverlay round={round} game={game} />
      ) : round.state === 'vote' ? (
        <VotePhaseGrid round={round} game={game} />
      ) : null}
    </div>
  )
}

function Timer({ targetTime }: { targetTime: number }) {
  const seconds = useCountdown(targetTime)
  const formatted = String(seconds).padStart(2, '0')
  return (
    <div className="timer-badge">
      <span>{formatted}s</span>
    </div>
  )
}
