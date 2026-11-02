import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { markIntroSeen, shouldShowIntro } from '../../lib/intro'
import { profile } from '../../data/profile'
import s from './Preloader.module.css'


/** Short intro: name letters + 0→100 counter, then a curtain lifts. Shown once per session. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(shouldShowIntro)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!show) {
      onDone()
      return
    }
    const start = performance.now()
    const total = 750
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        markIntroSeen()
        setShow(false)
        onDone() // reveal the hero while the curtain is still sliding away
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={s.curtain}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className={s.name} aria-hidden="true">
            {profile.name.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.03 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </div>
          <span className={s.count} aria-hidden="true">
            {String(count).padStart(3, '0')}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
