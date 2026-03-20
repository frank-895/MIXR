import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export function WaitingScreen({ gameId }: { gameId: Id<'games'> }) {
  const players = useQuery(api.players.listByGame, { gameId })

  return (
    <div className="screen center">
      <h1>You're in!</h1>
      <p>Waiting for the host to start the game...</p>

      <div className="player-list">
        <h2>Players ({players?.length ?? 0})</h2>
        <ul>
          {players?.map((p) => (
            <li key={p._id}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
