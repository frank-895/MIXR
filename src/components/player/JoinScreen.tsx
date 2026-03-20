import { useMutation } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export function JoinScreen({
  gameId,
  gameState,
  onJoined,
}: {
  gameId: Id<'games'>
  gameState: string
  onJoined: (id: Id<'players'>) => void
}) {
  const joinGame = useMutation(api.players.join)
  const [name, setName] = useState('')
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (gameState !== 'lobby') {
    return (
      <div className="screen center">
        <h1>Mixr</h1>
        <p>This game has already started.</p>
      </div>
    )
  }

  const handleJoin = async () => {
    if (!name.trim()) return
    setJoining(true)
    setError('')
    try {
      const playerId = await joinGame({ gameId, name: name.trim() })
      onJoined(playerId)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join')
      setJoining(false)
    }
  }

  return (
    <div className="screen center">
      <h1>Mixr</h1>
      <p>Join the game</p>

      <div className="form-group">
        <input
          ref={inputRef}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          maxLength={20}
        />
      </div>

      <button
        type="button"
        onClick={handleJoin}
        disabled={joining || !name.trim()}
      >
        {joining ? 'Joining...' : 'Join'}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
