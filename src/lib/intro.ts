import { safeStorage } from './hooks'

const store = safeStorage('session')

/** True only for the first visit of a session, and never with reduced motion or ?intro=0 (used for tests). */
export function shouldShowIntro() {
  if (typeof window === 'undefined') return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return !reduce && store.get('seen-intro') !== '1' && !location.search.includes('intro=0')
}

export const markIntroSeen = () => store.set('seen-intro', '1')
