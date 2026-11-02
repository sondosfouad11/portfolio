// "Below the fold" sections (and the footer) load after the first screen has painted, so the first
// paint downloads and runs less code. They appear one at a time (so no single long task blocks the
// page), or all at once when the visitor starts scrolling or jumps to one from the menu.
import { useSyncExternalStore } from 'react'

export const TOTAL_SECTIONS = 8 // about, services, work, more, skills, experience, faq, contact

let count = 0
let timer = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((fn) => fn())

export const sectionsOpen = () => count >= TOTAL_SECTIONS

/** Start showing sections: one every ~120 ms, or all immediately with { all: true }. */
export function openSections(opts: { all?: boolean } = {}) {
  if (opts.all) {
    window.clearTimeout(timer)
    timer = 0
    if (count < TOTAL_SECTIONS) {
      count = TOTAL_SECTIONS
      emit()
    }
    return
  }
  if (timer || count >= TOTAL_SECTIONS) return
  const step = () => {
    timer = 0
    if (count >= TOTAL_SECTIONS) return
    count++
    emit()
    if (count < TOTAL_SECTIONS) timer = window.setTimeout(step, 120)
  }
  step()
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** How many sections may render so far (0 until the first screen has painted). */
export const useSectionCount = () => useSyncExternalStore(subscribe, () => count, () => 0)

/** Resolves when `test()` is true (checked every frame), or after `timeoutMs`. */
export function waitFor(test: () => boolean, timeoutMs = 2500) {
  return new Promise<void>((resolve) => {
    const start = performance.now()
    const check = () => (test() || performance.now() - start > timeoutMs ? resolve() : requestAnimationFrame(check))
    check()
  })
}
