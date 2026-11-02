import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import s from './AmbientGlow.module.css'

/**
 * Two soft, blurred lights fixed behind the page. As you scroll they travel across the screen and
 * hand over from the warm accent light to a cooler neutral one, so each section sits in a slightly
 * different atmosphere. Only transform and opacity change.
 */
export function AmbientGlow() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 })

  const warmX = useTransform(p, [0, 0.35, 0.7, 1], ['55vw', '-10vw', '40vw', '5vw'])
  const warmY = useTransform(p, [0, 0.5, 1], ['10vh', '45vh', '20vh'])
  const warmO = useTransform(p, [0, 0.12, 0.45, 0.75, 1], [0, 0.7, 0.35, 0.8, 0.5])
  const coolX = useTransform(p, [0, 0.5, 1], ['-15vw', '50vw', '20vw'])
  const coolY = useTransform(p, [0, 0.5, 1], ['60vh', '5vh', '50vh'])
  const coolO = useTransform(p, [0, 0.3, 0.6, 1], [0, 0.6, 0.25, 0.4])

  if (reduce) return null
  return (
    <div className={s.layer} aria-hidden="true">
      <motion.i className={`${s.blob} ${s.warm}`} style={{ x: warmX, y: warmY, opacity: warmO }} />
      <motion.i className={`${s.blob} ${s.cool}`} style={{ x: coolX, y: coolY, opacity: coolO }} />
    </div>
  )
}
