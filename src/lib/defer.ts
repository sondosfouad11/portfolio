/**
 * Runs `job` once, after the first sign of a real visitor (scroll, touch, key, mouse move) or after
 * `fallbackMs`, whichever comes first. Used for work that is not needed to show the first screen
 * (smooth scrolling, fetching the sections below the fold), so it never competes with the first paint.
 */
export function afterFirstInteraction(job: () => void, fallbackMs = 4000) {
  const events = ['pointerdown', 'pointermove', 'wheel', 'scroll', 'touchstart', 'keydown'] as const
  let done = false
  const run = () => {
    if (done) return
    done = true
    cleanup()
    job()
  }
  const timer = window.setTimeout(run, fallbackMs)
  const cleanup = () => {
    window.clearTimeout(timer)
    for (const e of events) window.removeEventListener(e, run)
  }
  for (const e of events) window.addEventListener(e, run, { passive: true, once: true })
  return cleanup
}
