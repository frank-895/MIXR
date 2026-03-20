import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { useCountdown } from '../../lib/useCountdown'

export function CaptionScreen({
  round,
  playerId,
  game,
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!existing) {
      inputRef.current?.focus()
    }
  }, [existing])

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

  return (
    <div className="screen center">
      <div className="round-header">
        <span>
          Round {game.currentRound} / {game.totalRounds}
        </span>
        <span className="timer">{seconds}s</span>
      </div>

      <img className="meme-image" src={round.imageUrl} alt="Meme template" />

      {existing ? (
        <div className="submitted">
          <p>Caption submitted!</p>
          <p className="caption-text">"{existing.text}"</p>
        </div>
      ) : (
        <>
          <div className="form-group">
            <input
              ref={inputRef}
              type="text"
              placeholder="Write your caption..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              maxLength={200}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Caption'}
          </button>
        </>
      )}
    </div>
  )
}
