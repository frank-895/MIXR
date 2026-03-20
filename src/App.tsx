import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../convex/_generated/api'
import { HostApp } from './components/host/HostApp'
import { Marquee } from './components/Marquee'
import { PlayerApp } from './components/player/PlayerApp'
import { useRoute } from './lib/useRoute'

function App() {
  const { mode, gameCode, navigate } = useRoute()

  if (mode === 'host' && gameCode) {
    return <HostApp gameCode={gameCode} />
  }

  if (mode === 'player' && gameCode) {
    return (
      <>
        <div className="app-shell">
          <PlayerApp gameCode={gameCode} />
        </div>
        <Marquee />
      </>
    )
  }

  return (
    <>
      <div className="app-shell">
        <Landing navigate={navigate} />
      </div>
      <Marquee />
    </>
  )
}

function Landing({
  navigate,
}: { navigate: (params: Record<string, string>) => void }) {
  const createGame = useMutation(api.games.createGame)
  const [rounds, setRounds] = useState(3)
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const { code } = await createGame({ totalRounds: rounds })
      navigate({ host: code })
    } catch {
      setCreating(false)
    }
  }

  return (
    <main className="screen center">
      <div className="text-center mb-8">
        <h1>
          KNOW
          <br />
          YOUR MEME
        </h1>
      </div>

      <div className="form-stack">
        <div>
          <label className="sr-only" htmlFor="rounds">
            Number of rounds
          </label>
          <select
            id="rounds"
            className="brutal-select"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'ROUND' : 'ROUNDS'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className="brutal-btn"
        onClick={handleCreate}
        disabled={creating}
      >
        <span>{creating ? 'CREATING...' : 'HOST A GAME'}</span>
        <span className="material-symbols-outlined" aria-hidden="true">
          videogame_asset
        </span>
      </button>
    </main>
  )
}

export default App
