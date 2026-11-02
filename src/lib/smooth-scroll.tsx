import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { afterFirstInteraction } from './defer'
import { openSections, sectionsOpen, waitFor } from './sections'
import { nativeScrollTo, ScrollContext, type ScrollApi } from './scroll-context'

type LenisInstance = import('lenis').default

/**
 * Lenis smooth scrolling, wired into GSAP's ticker so ScrollTrigger stays in sync. Off when reduced motion is on.
 * Lenis and GSAP are loaded after the page is interactive (not part of the first download); until then the
 * browser scrolls natively, which is exactly what the code falls back to.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const lenis = useRef<LenisInstance | null>(null)

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    let cleanup = () => {}

    const start = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const instance = new Lenis({ lerp: 0.1, smoothWheel: true })
      lenis.current = instance
      instance.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => instance.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      cleanup = () => {
        gsap.ticker.remove(tick)
        instance.destroy()
        lenis.current = null
      }
    }

    // start after the first scroll/touch (or 3 s) so it never competes with the first paint
    const cancelWait = afterFirstInteraction(() => void start(), 3000)

    return () => {
      cancelled = true
      cancelWait()
      cleanup()
    }
  }, [reduce])

  // Stable object: it looks up the current Lenis instance at call time.
  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo: (target, opts) => {
        const go = () => {
          if (lenis.current) {
            lenis.current.scrollTo(target, { offset: opts?.offset ?? 0, immediate: opts?.immediate })
          } else {
            nativeScrollTo(target, opts)
          }
        }
        // A jump to a section that is not loaded yet: load everything first, then scroll, so the page
        // does not move under the visitor after they land.
        if (typeof target === 'string' && !sectionsOpen()) {
          openSections({ all: true })
          void waitFor(() => {
            const el = document.querySelector(target)
            return !!el && !el.hasAttribute('data-hold')
          }).then(() => requestAnimationFrame(go))
          return
        }
        go()
      },
    }),
    [],
  )

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}
