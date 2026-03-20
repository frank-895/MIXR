import { useEffect, useState } from 'react'

export function useCountdown(targetTime: number): number {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.ceil((targetTime - Date.now()) / 1000))
  )

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000))
      setSecondsLeft(remaining)
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetTime])

  return secondsLeft
}
