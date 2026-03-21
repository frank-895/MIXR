import { useConvex, useMutation } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
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
    return (
      <div className="app-shell">
        <PlayerApp gameCode={gameCode} />
      </div>
    )
  }

  if (mode === 'host-landing') {
    return (
      <div className="app-shell">
        <HostLanding navigate={navigate} />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <JoinPage navigate={navigate} />
    </div>
  )
}

function JoinPage({
  navigate,
}: {
  navigate: (path: string, params?: Record<string, string>) => void
}) {
  const convex = useConvex()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setError('')
    setChecking(true)
    try {
      const game = await convex.query(api.games.getByCode, { code: trimmed })
      if (game) {
        navigate('/', { code: trimmed })
      } else {
        setError('GAME NOT FOUND')
      }
    } catch {
      setError('SOMETHING WENT WRONG')
    } finally {
      setChecking(false)
    }
  }

  return (
    <main className="screen center">
      <div className="text-center mb-8">
        <p className="brand-label">MIXR</p>
        <h1>CAPTION THIS</h1>
      </div>

      <div className="form-stack">
        <input
          type="text"
          className="brutal-input"
          placeholder="ENTER GAME CODE"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          maxLength={6}
          style={{ textAlign: 'center', letterSpacing: 4, fontSize: 24 }}
        />
        {error && (
          <p
            style={{
              color: '#ef4444',
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        className="brutal-btn"
        onClick={handleJoin}
        disabled={!code.trim() || checking}
      >
        <span>{checking ? 'CHECKING...' : 'JOIN GAME'}</span>
        <span className="material-symbols-outlined" aria-hidden="true">
          login
        </span>
      </button>
    </main>
  )
}

function HostLanding({
  navigate,
}: {
  navigate: (path: string, params?: Record<string, string>) => void
}) {
  const createGame = useMutation(api.games.createGame)
  const [rounds, setRounds] = useState(3)
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const { code } = await createGame({ totalRounds: rounds })
      navigate('/host', { code })
    } catch {
      setCreating(false)
    }
  }

  return (
    <main className="screen center">
      <div className="text-center mb-8">
        <p className="brand-label">MIXR</p>
        <h1>CAPTION THIS</h1>
      </div>

      <div className="form-stack">
        <RoundsPicker value={rounds} onChange={setRounds} />
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

function RoundsPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const options = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="rounds-picker" ref={ref}>
      <button
        type="button"
        className="rounds-picker__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>
          {value} {value === 1 ? 'ROUND' : 'ROUNDS'}
        </span>
        <span
          className={`material-symbols-outlined rounds-picker__chevron ${open ? 'rounds-picker__chevron--open' : ''}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="rounds-picker__menu" role="listbox">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              role="option"
              aria-selected={n === value}
              className={`rounds-picker__option ${n === value ? 'rounds-picker__option--active' : ''}`}
              onClick={() => {
                onChange(n)
                setOpen(false)
              }}
            >
              {n} {n === 1 ? 'ROUND' : 'ROUNDS'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
