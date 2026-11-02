import { useState } from 'react'
import { motion } from 'framer-motion'

const colors = ['var(--accent-text)', 'var(--accent-2)', 'var(--accent-3)', 'var(--text)']

/** A small burst of pieces that fly out from the center and fade. Mount it with a new key to replay. */
export function Confetti({ count = 22 }: { count?: number }) {
  const [pieces] = useState(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
        const dist = 90 + Math.random() * 120
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 30,
          r: Math.random() * 540 - 270,
          size: 6 + Math.random() * 8,
          color: colors[i % colors.length],
          round: i % 3 === 0,
        }
      }),

  )
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '50%', top: '45%', pointerEvents: 'none', zIndex: 10 }}
    >
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y + 60, opacity: 0, rotate: p.r, scale: 0.6 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            borderRadius: p.round ? '50%' : 2,
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}
