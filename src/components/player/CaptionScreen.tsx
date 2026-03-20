import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { useCountdown } from '../../lib/useCountdown'

export function CaptionScreen({
  round,
  playerId,
  game: _game,
}: {
  round: Doc<'rounds'>
  playerId: Id<'players'>
  game: { currentRound: number; totalRounds: number }
}) {
  const submitCaption = useMutation(api.captions.submit)
  const existing = useQuery(api.captions.getPlayerCaption, {
    playerId,
    roundId: round._id,
  })
  const seconds = useCountdown(round.captionEndsAt)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await submitCaption({
        playerId,
        roundId: round._id,
        text: text.trim(),
      })
    } catch {
      setSubmitting(false)
    }
  }

  const formatted = String(seconds).padStart(2, '0')

  // Waiting overlay after submission
  if (existing) {
    return (
      <>
        <div className="waiting-overlay">
          <div className="waiting-overlay-box">
            <span
              className="material-symbols-outlined animate-spin"
              aria-hidden="true"
              style={{ fontSize: 64, marginBottom: 24, display: 'block', color: 'white' }}
            >
              hourglass_empty
            </span>
            <h2>
              WAITING
              <br />
              FOR
              <br />
              SLOWPOKES...
            </h2>
            <p className="animate-pulse" style={{ marginTop: 24 }}>
              DO NOT CLOSE APP
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="brutal-header">
        <div style={{ width: 48 }} />
        <div className="timer-badge">
          <span className="material-symbols-outlined">timer</span>
          <span>00:{formatted}</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 120 }}>
        {/* Meme Image */}
        <div className="meme-frame">
          <img src={round.imageUrl} alt="Meme template" />
        </div>

        {/* Caption Input */}
        <div style={{ position: 'relative' }}>
          <label className="sr-only" htmlFor="caption">
            Enter your meme caption
          </label>
          <textarea
            id="caption"
            className="brutal-textarea"
            placeholder="MAKE IT FUNNY..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 140))}
            maxLength={140}
          />
          <div className="char-counter">
            <span>{text.length}</span>/140
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed-bottom">
        <button
          type="button"
          className="brutal-btn brutal-btn--green"
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
        >
          <span>{submitting ? 'SUBMITTING...' : 'SUBMIT CAPTION'}</span>
          <span className="material-symbols-outlined" aria-hidden="true">
            send
          </span>
        </button>
      </div>
    </>
  )
}
