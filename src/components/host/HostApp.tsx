import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Loader } from '../Loader'
import { FinalResults } from './FinalResults'
import { Lobby } from './Lobby'
import { RoundScreen } from './RoundScreen'

export function HostApp({ gameCode }: { gameCode: string }) {
  const hostView = useQuery(api.games.getHostViewByCode, { code: gameCode })

  if (hostView === undefined) {
    return (
      <div className="host-shell">
        <main className="screen center">
          <Loader />
          <h2>LOADING...</h2>
        </main>
      </div>
    )
  }

  if (hostView.status === 'notFound') {
    return (
      <div className="host-shell">
        <main className="screen center">
          <h1>GAME NOT FOUND</h1>
        </main>
      </div>
    )
  }

  if (hostView.status === 'forbidden') {
    return (
      <div className="host-shell">
        <main className="screen center">
          <h1>HOST ACCESS DENIED</h1>
          <p style={{ margin: 0, textAlign: 'center', maxWidth: 360 }}>
            You can&apos;t manage this game from this session.
          </p>
        </main>
      </div>
    )
  }

  const { game } = hostView

  if (game.state === 'lobby') {
    return <Lobby game={game} gameCode={gameCode} />
  }

  if (game.state === 'playing') {
    return <RoundScreen game={game} />
  }

  return <FinalResults game={game} />
}
