/**
 * Cross-platform haptic feedback that works during drag gestures.
 *
 * navigator.vibrate (Android) is called directly — no async wrapper.
 * For iOS (no vibrate API), we pulse a near-silent AudioContext click
 * which triggers the Taptic Engine on supported devices.
 */

let audioCtx: AudioContext | null = null

function ensureAudioCtx(): AudioContext | null {
  if (audioCtx) return audioCtx
  if (typeof AudioContext === 'undefined') return null
  audioCtx = new AudioContext()
  return audioCtx
}

/** Must be called once from a direct user tap to unlock AudioContext on iOS. */
export function unlockHaptics() {
  const ctx = ensureAudioCtx()
  if (ctx?.state === 'suspended') {
    ctx.resume()
  }
}

function tapticPulse(durationMs: number, intensity: number) {
  const ctx = ensureAudioCtx()
  if (!ctx || ctx.state !== 'running') return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  // Sub-audible frequency — felt, not heard
  osc.frequency.value = 1
  gain.gain.value = intensity * 0.01 // nearly silent
  osc.start()
  osc.stop(ctx.currentTime + durationMs / 1000)
}

export function hapticLight() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(15)
  } else {
    tapticPulse(15, 0.4)
  }
}

export function hapticMedium() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(25)
  } else {
    tapticPulse(25, 0.7)
  }
}

export function hapticHeavy() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([30, 60, 40])
  } else {
    tapticPulse(30, 1)
    setTimeout(() => tapticPulse(40, 1), 90)
  }
}
