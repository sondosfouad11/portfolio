import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../../data/projects'
import type { ProjectKind } from '../../data/types'
import { ProjectCard } from '../ui/ProjectCard'
import { RevealWords } from '../ui/Reveal'
import s from './Work.module.css'

gsap.registerPlugin(ScrollTrigger)

type Filter = 'all' | ProjectKind
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'built', label: 'Built' },
  { id: 'uiux', label: 'UI·UX' },
  { id: 'brand', label: 'Brand' },
]

export function Work() {
  const [filter, setFilter] = useState<Filter>('all')
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const shown = projects.filter((p) => filter === 'all' || p.kind === filter)

  // The pinned gallery measures where it starts and ends when it is created. Sections above it (and images,
  // and fonts) can finish loading later and push it down, so the measurements must be redone whenever the
  // page height changes. Without this the gallery sticks too early and the whole block jumps back.
  useEffect(() => {
    let timer = 0
    const refresh = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    window.addEventListener('load', refresh)
    void document.fonts?.ready.then(refresh)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener('load', refresh)
    }
  }, [])

  // Desktop: pin the section and scroll the cards sideways. Phones and reduced-motion users get a swipeable snap row (pure CSS).
  useLayoutEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      pin.classList.add(s.pinned)
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      // The card near the middle of the screen is scaled up, the others fade back.
      const cards = Array.from(track.children) as HTMLElement[]
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: 'left 75%',
          end: 'right 25%',
          toggleClass: { targets: card, className: s.focus },
        })
      })
      return () => pin.classList.remove(s.pinned)
    })
    return () => mm.revert()
  }, [filter])

  const pick = (id: Filter) => {
    if (id === filter) return
    // Return to the top of the section first so the pinned scroll position never lands in the wrong place.
    const top = pinRef.current?.parentElement?.getBoundingClientRect().top ?? 0
    if (top < 0) window.scrollBy({ top })
    setFilter(id)
  }

  return (
    <section className={s.work} id="work" aria-labelledby="work-title">
      <div ref={pinRef} className={s.pin}>
        <div className={`container ${s.head}`}>
          <div>
            <p className="eyebrow">03 — Selected work</p>
            <RevealWords as="h2" className={s.title} text="Things I’ve *made*." />
          </div>
          <div className={s.tabs} role="tablist" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={filter === f.id ? s.tabOn : ''}
                onClick={() => pick(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul ref={trackRef} className={s.track} key={filter}>
          {shown.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
