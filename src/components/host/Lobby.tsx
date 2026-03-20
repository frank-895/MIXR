import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'

export function Lobby({
  game,
  gameCode,
}: {
  game: Doc<'games'>
  gameCode: string
}) {
  const players = useQuery(api.players.listByGame, { gameId: game._id })
  const startGame = useMutation(api.games.startGame)

  const joinUrl = `${window.location.origin}?game=${gameCode}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`

  return (
    <div className="screen">
      <h1>Game Lobby</h1>
      <p className="game-code">
        Code: <strong>{gameCode}</strong>
      </p>

      <div className="qr-section">
        <img src={qrUrl} alt="QR code to join game" width={200} height={200} />
        <p className="join-url">{joinUrl}</p>
      </div>

      <div className="player-list">
        <h2>Players ({players?.length ?? 0})</h2>
        <ul>
          {players?.map((p) => (
            <li key={p._id}>{p.name}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => startGame({ gameId: game._id })}
        disabled={!players || players.length < 2}
      >
        Start Game
      </button>
      {players && players.length < 2 && (
        <p className="hint">Need at least 2 players to start</p>
      )}
    </div>
  )
}
