import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { FinalResults } from './FinalResults'
import { Lobby } from './Lobby'
import { RoundScreen } from './RoundScreen'

export function HostApp({ gameCode }: { gameCode: string }) {
  const game = useQuery(api.games.getByCode, { code: gameCode })

  if (game === undefined) {
    return (
      <div className="host-shell">
        <main className="screen center">
          <span
            className="material-symbols-outlined animate-spin"
            style={{ fontSize: 48 }}
          >
            hourglass_empty
          </span>
          <h2>LOADING...</h2>
        </main>
      </div>
    )
  }

  if (game === null) {
    return (
      <div className="host-shell">
        <main className="screen center">
          <h1>GAME NOT FOUND</h1>
        </main>
      </div>
    )
  }

  if (game.state === 'lobby') {
    return <Lobby game={game} gameCode={gameCode} />
  }

  if (game.state === 'playing') {
    return <RoundScreen game={game} />
  }

  return <FinalResults game={game} />
}
