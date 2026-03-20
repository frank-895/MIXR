import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { useCountdown } from '../../lib/useCountdown'

export function VoteScreen({
  round,
  playerId,
  game,
}: {
  round: Doc<'rounds'>
  playerId: Id<'players'>
  game: { currentRound: number; totalRounds: number }
}) {
  const candidates = useQuery(api.votes.getCandidates, {
    playerId,
    roundId: round._id,
    count: 5,
  })
  const castVote = useMutation(api.votes.castVote)
  const seconds = useCountdown(round.voteEndsAt)

  const current = candidates?.[0]

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

  return (
    <div className="screen center">
      <div className="round-header">
        <span>
          Round {game.currentRound} / {game.totalRounds}
        </span>
        <span className="timer">{seconds}s</span>
      </div>

      <img className="meme-image" src={round.imageUrl} alt="Meme template" />

      {current ? (
        <div className="vote-card">
          <p className="caption-text">"{current.text}"</p>
          <div className="vote-buttons">
            <button
              type="button"
              className="vote-up"
              onClick={() => handleVote(true)}
            >
              Upvote
            </button>
            <button
              type="button"
              className="vote-down"
              onClick={() => handleVote(false)}
            >
              Downvote
            </button>
          </div>
        </div>
      ) : (
        <p>No more captions to vote on!</p>
      )}
    </div>
  )
}
