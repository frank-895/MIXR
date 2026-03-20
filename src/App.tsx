import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../convex/_generated/api'
import { HostApp } from './components/host/HostApp'
import { PlayerApp } from './components/player/PlayerApp'
import { useRoute } from './lib/useRoute'

function App() {
  const { mode, gameCode, navigate } = useRoute()

  if (mode === 'host' && gameCode) {
    return <HostApp gameCode={gameCode} />
  }

  if (mode === 'player' && gameCode) {
    return <PlayerApp gameCode={gameCode} />
  }

  return <Landing navigate={navigate} />
}

function Landing({
  navigate,
}: {
  navigate: (params: Record<string, string>) => void
}) {
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
    <div className="screen center">
      <h1>Mixr</h1>
      <p>The meme caption game</p>

      <div className="form-group">
        <label htmlFor="rounds">Number of rounds</label>
        <select
          id="rounds"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={handleCreate} disabled={creating}>
        {creating ? 'Creating...' : 'Host a Game'}
      </button>
    </div>
  )
}

export default App
