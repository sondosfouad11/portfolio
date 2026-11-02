import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** True when the device has a real mouse (not a touch screen). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

export function safeStorage(kind: 'local' | 'session' = 'local') {
  const get = (key: string) => {
    try {
      return (kind === 'local' ? localStorage : sessionStorage).getItem(key)
    } catch {
      return null
    }
  }
  const set = (key: string, value: string) => {
    try {
      ;(kind === 'local' ? localStorage : sessionStorage).setItem(key, value)
    } catch {
      /* storage can be blocked: the site still works without it */
    }
  }
  return { get, set }
}
