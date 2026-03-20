import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { useCountdown } from '../../lib/useCountdown'

export function VoteScreen({
  round,
  playerId,
  game: _game,
}: {
  round: Doc<'rounds'>
  playerId: Id<'players'>
  game: Doc<'games'>
}) {
  const candidates = useQuery(api.votes.getCandidates, {
    playerId,
    roundId: round._id,
    count: 5,
  })
  const allCaptions = useQuery(api.captions.listByRound, {
    roundId: round._id,
  })
  const castVote = useMutation(api.votes.castVote)
  const seconds = useCountdown(round.voteEndsAt)

  const current = candidates?.[0]
  const totalCaptions =
    allCaptions?.filter((c) => c.userId !== playerId).length ?? 0
  const votedCount = totalCaptions - (candidates?.length ?? 0)
  const progressPct = totalCaptions > 0 ? (votedCount / totalCaptions) * 100 : 0

  const handleVote = async (value: boolean) => {
    if (!current) return
    try {
      await castVote({
        playerId,
        captionId: current.captionId,
        value,
      })
    } catch {
      // Vote may have already been cast or phase ended
    }
  }

  const formatted = String(seconds).padStart(2, '0')

  return (
    <>
      {/* Header */}
      <header className="brutal-header">
        <div style={{ width: 48 }} />
        <div
          className="badge badge--primary"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          JUDGE EM
        </div>
        <div style={{ width: 48 }} />
      </header>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">
            {votedCount} / {totalCaptions} MEMES
          </span>
          <div className="progress-timer">0:{formatted}</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          position: 'relative',
        }}
      >
        {current ? (
          <>
            {/* Meme Card */}
            <div
              className="meme-frame meme-frame--tall"
              style={{ maxHeight: 530, marginBottom: 32 }}
            >
              <img
                src={round.imageUrl}
                alt="Meme template"
                style={{ filter: 'grayscale(100%) contrast(1.25)' }}
              />
              {/* Caption Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 24,
                  pointerEvents: 'none',
                }}
              >
                <h2 className="impact-text">{current.text}</h2>
              </div>
            </div>

            {/* Vote Buttons */}
            <div className="vote-buttons">
              <button
                type="button"
                className="vote-btn vote-btn--reject"
                onClick={() => handleVote(false)}
                aria-label="Reject"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <button
                type="button"
                className="vote-btn vote-btn--approve"
                onClick={() => handleVote(true)}
                aria-label="Approve"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </button>
            </div>
          </>
        ) : (
          <div
            className="brutal-card"
            style={{ padding: 32, textAlign: 'center' }}
          >
            <span
              className="material-symbols-outlined animate-spin"
              aria-hidden="true"
              style={{ fontSize: 48, marginBottom: 16, display: 'block' }}
            >
              hourglass_empty
            </span>
            <h2>NO MORE MEMES</h2>
            <p style={{ marginTop: 8 }}>WAITING FOR NEW CAPTIONS...</p>
          </div>
        )}
      </main>
    </>
  )
}
