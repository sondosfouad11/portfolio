import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Moves its content slightly slower than the page while it scrolls past (transform only).
 * Wrap an image inside a box with `overflow: hidden`; the image is scaled up a little so its edges never show.
 */
export function Parallax({
  children,
  amount = 8,
  className,
}: {
  children: ReactNode
  /** total travel in percent of the element's height */
  amount?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-amount / 2}%`, `${amount / 2}%`])

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', height: '100%' }}>
      <motion.div
        style={reduce ? { height: '100%' } : { y, scale: 1 + amount / 100, height: '100%' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
