import { useQuery } from 'convex/react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'

const VOTE_DISPLAY_THROTTLE_MS = 3_000

function useThrottled<T>(value: T, ms: number): T {
  const [throttled, setThrottled] = useState(value)
  const lastUpdate = useRef(Date.now())
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastUpdate.current

    if (elapsed >= ms) {
      lastUpdate.current = now
      setThrottled(value)
    } else if (!pending.current) {
      pending.current = setTimeout(() => {
        lastUpdate.current = Date.now()
        setThrottled(value)
        pending.current = null
      }, ms - elapsed)
    }

    return () => {
      if (pending.current) {
        clearTimeout(pending.current)
        pending.current = null
      }
    }
  }, [value, ms])

  return throttled
}

export function VotePhaseGrid({
  round,
}: {
  round: Doc<'rounds'>
  game: Doc<'games'>
}) {
  const captions = useQuery(api.captions.getRoundCaptions, {
    roundId: round._id,
  })
  const throttledCaptions = useThrottled(captions, VOTE_DISPLAY_THROTTLE_MS)

  if (!throttledCaptions) return null

  const top5 = throttledCaptions.slice(0, 5)
  const maxScore = Math.max(1, ...top5.map((c) => Math.max(0, c.score)))

  return (
    <div className="vote-phase-layout">
      <div className="vote-phase-meme">
        <div className="meme-frame">
          <img src={round.imageUrl} alt="Meme template" />
        </div>
      </div>

      <div className="vote-phase-bars">
        {top5.map((entry) => {
          const clampedScore = Math.max(0, entry.score)
          const pct = (clampedScore / maxScore) * 100
          const isLeading = clampedScore === maxScore && maxScore > 0
          return (
            <div key={entry.captionId} className="vote-bar-row">
              <motion.div
                className={`vote-bar-fill${isLeading ? ' vote-bar-fill--leading' : ''}`}
                animate={{ width: `${Math.max(pct, 8)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
              {clampedScore > 0 && (
                <span className="vote-bar-score">{clampedScore}</span>
              )}
              <div className="vote-bar-text">
                <span className="vote-bar-caption">{entry.text}</span>
                <span className="vote-bar-name">{entry.playerName}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
