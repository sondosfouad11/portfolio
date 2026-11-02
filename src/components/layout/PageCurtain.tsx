import { useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * On every navigation (not the first load) a panel sweeps up from the bottom, covers the page swap,
 * and continues out through the top. It is timed so the old page fades out while covered.
 */
export function PageCurtain() {
  const location = useLocation()
  const reduce = useReducedMotion()

  // React Router gives the first entry the key "default"; every navigation after that gets a new key.
  if (reduce || location.key === 'default') return null
  return (
    <motion.div
      key={location.key}
      aria-hidden="true"
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 1.1, times: [0, 0.35, 0.5, 1], ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 140,
        background: 'var(--bg-2)',
        pointerEvents: 'none',
      }}
    />
  )
}
