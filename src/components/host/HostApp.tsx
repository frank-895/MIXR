import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { FinalResults } from './FinalResults'
import { Lobby } from './Lobby'
import { RoundScreen } from './RoundScreen'

export function HostApp({ gameCode }: { gameCode: string }) {
  const game = useQuery(api.games.getByCode, { code: gameCode })

  if (game === undefined) {
    return <div className="screen center">Loading...</div>
  }

  if (game === null) {
    return <div className="screen center">Game not found</div>
  }

  if (game.state === 'lobby') {
    return <Lobby game={game} gameCode={gameCode} />
  }

  if (game.state === 'playing') {
    return <RoundScreen game={game} />
  }

  return <FinalResults game={game} />
}
