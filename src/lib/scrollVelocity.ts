import { onFrame } from './frame'

/**
 * Smoothed page scroll velocity in px per second (negative = scrolling up).
 * One shared frame job feeds every consumer, so it costs one read of scrollY per frame.
 */
let velocity = 0
let lastY = typeof window === 'undefined' ? 0 : window.scrollY
let users = 0
let stop: (() => void) | null = null

const tick = (deltaMs: number) => {
  const y = window.scrollY
  const raw = deltaMs > 0 ? ((y - lastY) / deltaMs) * 1000 : 0
  lastY = y
  velocity += (raw - velocity) * 0.15 // ease toward the latest value so spikes don't jerk things
}

export function subscribeScrollVelocity() {
  if (users++ === 0) {
    lastY = window.scrollY
    stop = onFrame(tick)
  }
  return () => {
    if (--users === 0) {
      stop?.()
      stop = null
    }
  }
}

export const getScrollVelocity = () => velocity
