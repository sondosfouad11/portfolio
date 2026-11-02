import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        position: 'fixed',
        inset: '0 0 auto 0',
        height: 3,
        transformOrigin: '0 50%',
        background: 'var(--accent)',
        zIndex: 120,
      }}
    />
  )
}
