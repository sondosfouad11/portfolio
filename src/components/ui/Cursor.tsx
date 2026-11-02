import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer } from '../../lib/hooks'
import s from './Cursor.module.css'

/**
 * Dot + ring cursor. Elements can set data-cursor="View" to show a label.
 * Links and buttons make the ring grow. Not rendered on touch devices.
 */
export function Cursor() {
  const fine = useFinePointer()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 })
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!fine) return
    document.body.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button, summary')
      setActive(!!el)
      setLabel(el?.dataset.cursor ?? '')
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [fine, x, y])

  if (!fine) return null

  return (
    <>
      <motion.div className={s.dot} style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`${s.ring} ${active ? s.active : ''} ${label ? s.hasLabel : ''} ${pressed ? s.pressed : ''}`}
        style={{ x: rx, y: ry }}
        aria-hidden="true"
      >
        <span className={s.label}>{label}</span>
      </motion.div>
    </>
  )
}
