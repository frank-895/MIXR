import { useCallback, useSyncExternalStore } from 'react'

type Route =
  | { mode: 'landing'; gameCode: null }
  | { mode: 'host'; gameCode: string }
  | { mode: 'player'; gameCode: string }

function getRoute(): Route {
  const params = new URLSearchParams(window.location.search)
  const host = params.get('host')
  const game = params.get('game')

  if (host) return { mode: 'host', gameCode: host.toUpperCase() }
  if (game) return { mode: 'player', gameCode: game.toUpperCase() }
  return { mode: 'landing', gameCode: null }
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

let currentRoute = getRoute()
function getSnapshot() {
  const next = getRoute()
  if (
    next.mode !== currentRoute.mode ||
    next.gameCode !== currentRoute.gameCode
  ) {
    currentRoute = next
  }
  return currentRoute
}

export function useRoute() {
  const route = useSyncExternalStore(subscribe, getSnapshot)

  const navigate = useCallback((params: Record<string, string>) => {
    const search = new URLSearchParams(params).toString()
    window.history.pushState(null, '', `?${search}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return { ...route, navigate }
}
