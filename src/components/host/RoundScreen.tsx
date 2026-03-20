import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useCountdown } from '../../lib/useCountdown'
import { Leaderboard } from './Leaderboard'

export function RoundScreen({ game }: { game: Doc<'games'> }) {
  const round = useQuery(api.rounds.getCurrent, { gameId: game._id })

  if (!round) {
    return <div className="screen center">Loading round...</div>
  }

  const targetTime =
    round.state === 'caption' ? round.captionEndsAt : round.voteEndsAt

  return (
    <div className="screen host-round">
      <div className="round-main">
        <div className="round-header">
          <span>
            Round {game.currentRound} / {game.totalRounds}
          </span>
          <span className="phase-label">
            {round.state === 'caption'
              ? 'Captioning...'
              : round.state === 'vote'
                ? 'Voting...'
                : 'Round Complete'}
          </span>
          {round.state !== 'finished' && <Timer targetTime={targetTime} />}
        </div>

        <img className="meme-image" src={round.imageUrl} alt="Meme template" />
      </div>

      <div className="round-sidebar">
        <Leaderboard gameId={game._id} />
      </div>
    </div>
  )
}

function Timer({ targetTime }: { targetTime: number }) {
  const seconds = useCountdown(targetTime)
  return <span className="timer">{seconds}s</span>
}
