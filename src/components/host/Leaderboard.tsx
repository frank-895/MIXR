import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export function Leaderboard({ gameId }: { gameId: Id<'games'> }) {
  const scores = useQuery(api.players.getScores, { gameId })

  if (!scores) return null

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
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
  )
}
