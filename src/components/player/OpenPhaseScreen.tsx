import { useState } from 'react'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { CaptionScreen } from './CaptionScreen'
import { VoteScreen } from './VoteScreen'

export function OpenPhaseScreen({
  round,
  playerId,
  game,
}: {
  round: Doc<'rounds'>
  playerId: Id<'players'>
  game: Doc<'games'>
}) {
  const [tab, setTab] = useState<'vote' | 'caption'>('vote')

  return (
    <>
      {/* Tab Toggle */}
      <div
        style={{
          display: 'flex',
          borderBottom: '4px solid var(--black)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setTab('caption')}
          style={{
            flex: 1,
            height: 56,
            border: 'none',
            borderRight: '2px solid var(--black)',
            background: tab === 'caption' ? 'var(--primary)' : 'var(--white)',
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 800,
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 0,
          }}
        >
          CAPTION
        </button>
        <button
          type="button"
          onClick={() => setTab('vote')}
          style={{
            flex: 1,
            height: 56,
            border: 'none',
            borderLeft: '2px solid var(--black)',
            background: tab === 'vote' ? 'var(--primary)' : 'var(--white)',
            fontFamily: 'var(--font-heading)',
            fontSize: 20,
            fontWeight: 800,
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 0,
          }}
        >
          VOTE
        </button>
      </div>

      {tab === 'caption' ? (
        <CaptionScreen
          round={round}
          playerId={playerId}
          game={game}
          deadline={round.voteEndsAt}
        />
      ) : (
        <VoteScreen round={round} playerId={playerId} game={game} />
      )}
    </>
  )
}
