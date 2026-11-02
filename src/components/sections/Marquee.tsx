import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { marqueeBottom, marqueeTop } from '../../data/content'
import { onFrame } from '../../lib/frame'
import { getScrollVelocity, subscribeScrollVelocity } from '../../lib/scrollVelocity'
import s from './Marquee.module.css'

interface RowProps {
  items: string[]
  /** 1 = moves left, -1 = moves right */
  direction: 1 | -1
  /** base speed relative to the first row */
  speedScale: number
  hovered: MutableRefObject<boolean>
  quiet?: boolean
}

/**
 * One looping row. The item list is repeated as many times as needed to cover the screen plus one
 * spare copy, then the track is moved by exactly one copy's width and wrapped, so the seam never shows,
 * even on ultra-wide screens.
 */
function Row({ items, direction, speedScale, hovered, quiet }: RowProps) {
  const reduce = useReducedMotion()
  const rowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLUListElement>(null)
  const [copies, setCopies] = useState(3)

  // How many copies are needed to cover the row (re-measured when the screen or font size changes).
  useLayoutEffect(() => {
    const group = groupRef.current
    const row = rowRef.current
    if (!group || !row) return
    const measure = () => {
      const w = group.offsetWidth
      if (w > 0) setCopies(Math.max(2, Math.ceil(row.offsetWidth / w) + 1))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(group)
    ro.observe(row)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (reduce) return
    const row = rowRef.current
    const track = trackRef.current
    const group = groupRef.current
    if (!row || !track || !group) return

    let x = 0
    let groupWidth = group.offsetWidth
    let hoverFactor = 1
    let scrollDir = 1
    let visible = true

    const ro = new ResizeObserver(() => (groupWidth = group.offsetWidth))
    ro.observe(group)
    // Don't spend frames on a strip nobody can see.
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(row)
    const unsubscribe = subscribeScrollVelocity()

    const tick = (deltaMs: number) => {
      if (!visible || groupWidth === 0) return
      const base = (window.innerWidth < 700 ? 34 : 52) * speedScale // px per second
      const v = getScrollVelocity()
      // Scrolling up gently turns the strip around; scrolling fast speeds it up (capped).
      if (Math.abs(v) > 30) scrollDir += ((v > 0 ? 1 : -1) - scrollDir) * 0.06
      const boost = 1 + Math.min(Math.abs(v) / 900, 2.5)
      hoverFactor += ((hovered.current ? 0 : 1) - hoverFactor) * 0.08
      x += (base * boost * hoverFactor * scrollDir * direction * Math.min(deltaMs, 50)) / 1000
      x = ((x % groupWidth) + groupWidth) % groupWidth
      track.style.transform = `translate3d(${-x}px, 0, 0)`
    }
    const stopFrame = onFrame(tick)
    return () => {
      stopFrame()
      unsubscribe()
      ro.disconnect()
      io.disconnect()
    }
  }, [reduce, direction, speedScale, hovered])

  return (
    <div ref={rowRef} className={`${s.row} ${quiet ? s.quiet : ''}`}>
      <div ref={trackRef} className={s.track}>
        {Array.from({ length: copies }, (_, c) => (
          <ul key={c} ref={c === 0 ? groupRef : undefined} className={s.group} aria-hidden={c > 0 || undefined}>
            {items.map((t) => (
              <li key={t}>
                {t}
                <span className={s.dot} aria-hidden="true">●</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export function Marquee() {
  const hovered = useRef(false)
  return (
    <div className={s.clip}>
      <section
        className={s.marquee}
        aria-label="Tools and skills"
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={() => (hovered.current = false)}
      >
        <Row items={marqueeTop} direction={1} speedScale={1} hovered={hovered} />
        <Row items={marqueeBottom} direction={-1} speedScale={0.8} hovered={hovered} quiet />
      </section>
    </div>
  )
}
