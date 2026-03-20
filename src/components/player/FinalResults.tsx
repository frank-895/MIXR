import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export function FinalResults({
  gameId,
  playerId,
}: {
  gameId: Id<'games'>
  playerId: Id<'players'>
}) {
  const scores = useQuery(api.players.getScores, { gameId })

  if (!scores) {
    return <div className="screen center">Loading results...</div>
  }

  const rank = scores.findIndex((s) => s.playerId === playerId) + 1
  const myScore = scores.find((s) => s.playerId === playerId)

  return (
    <div className="screen center">
      <h1>Game Over!</h1>

      {myScore && (
        <div className="my-result">
          <p className="rank-display">
            You placed <strong>#{rank}</strong>
          </p>
          <p className="score">{myScore.totalScore} points</p>
        </div>
      )}

      <div className="leaderboard">
        <h2>Final Standings</h2>
        <ol>
          {scores.map((entry, i) => (
            <li
              key={entry.playerId}
              className={`leaderboard-entry ${entry.playerId === playerId ? 'you' : ''}`}
            >
              <span className="rank">#{i + 1}</span>
              <span className="name">
                {entry.name}
                {entry.playerId === playerId ? ' (you)' : ''}
              </span>
              <span className="score">{entry.totalScore}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
