import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'

export function FinalResults({ game }: { game: Doc<'games'> }) {
  const scores = useQuery(api.players.getScores, { gameId: game._id })

  if (!scores) {
    return <div className="screen center">Loading results...</div>
  }

  const winner = scores[0]

  return (
    <div className="screen center">
      <h1>Game Over!</h1>

      {winner && (
        <div className="winner">
          <h2>Winner</h2>
          <p className="winner-name">{winner.name}</p>
          <p className="winner-score">{winner.totalScore} points</p>
        </div>
      )}

      <div className="leaderboard">
        <h2>Final Standings</h2>
        <ol>
          {scores.map((entry, i) => (
            <li key={entry.playerId} className="leaderboard-entry">
              <span className="rank">#{i + 1}</span>
              <span className="name">{entry.name}</span>
              <span className="score">{entry.totalScore}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
