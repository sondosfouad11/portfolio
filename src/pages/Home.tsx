import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { useScroll } from '../lib/scroll-context'
import { useSectionCount } from '../lib/sections'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Everything below the first screen is its own chunk, so the first screen needs less JavaScript.
const loaders = {
  about: () => import('../components/sections/About'),
  services: () => import('../components/sections/Services'),
  work: () => import('../components/sections/Work'),
  more: () => import('../components/sections/MoreWork'),
  skills: () => import('../components/sections/Skills'),
  experience: () => import('../components/sections/Experience'),
  faq: () => import('../components/sections/Faq'),
}
const About = lazy(() => loaders.about().then((m) => ({ default: m.About })))
const Services = lazy(() => loaders.services().then((m) => ({ default: m.Services })))
const Work = lazy(() => loaders.work().then((m) => ({ default: m.Work })))
const MoreWork = lazy(() => loaders.more().then((m) => ({ default: m.MoreWork })))
const Skills = lazy(() => loaders.skills().then((m) => ({ default: m.Skills })))
const Experience = lazy(() => loaders.experience().then((m) => ({ default: m.Experience })))
const Faq = lazy(() => loaders.faq().then((m) => ({ default: m.Faq })))

/**
 * Placeholder with the section's id, so menu links and #anchors still land in the right place
 * even in the moment before the chunk arrives. Its height is replaced by the real section.
 */
const Hold = ({ id, height = '70vh' }: { id: string; height?: string }) => (
  <div id={id} data-hold style={{ minHeight: height }} aria-hidden="true" />
)

export default function Home() {
  const { state } = useLocation()
  const { scrollTo } = useScroll()
  const shown = useSectionCount()
  useDocumentTitle()

  // Arrived from another page via the menu (e.g. "Skills" from a project page): scroll to that section.
  useEffect(() => {
    const id = (state as { scrollTo?: string } | null)?.scrollTo
    if (!id) return
    const t = setTimeout(() => scrollTo(`#${id}`), 450)
    return () => clearTimeout(t)
  }, [state, scrollTo])

  return (
    <main id="main">
      <Hero />
      <Marquee />
      {/* each section replaces its placeholder in turn (see lib/sections.ts) */}
      {shown > 0 ? (
        <Suspense fallback={<Hold id="about" />}>
          <About />
        </Suspense>
      ) : (
        <Hold id="about" />
      )}
      {shown > 1 ? (
        <Suspense fallback={<Hold id="services" />}>
          <Services />
        </Suspense>
      ) : (
        <Hold id="services" />
      )}
      {shown > 2 ? (
        <Suspense fallback={<Hold id="work" height="100vh" />}>
          <Work />
        </Suspense>
      ) : (
        <Hold id="work" height="100vh" />
      )}
      {shown > 3 && (
        <Suspense fallback={null}>
          <MoreWork />
        </Suspense>
      )}
      {shown > 4 ? (
        <Suspense fallback={<Hold id="skills" />}>
          <Skills />
        </Suspense>
      ) : (
        <Hold id="skills" />
      )}
      {shown > 5 ? (
        <Suspense fallback={<Hold id="experience" />}>
          <Experience />
        </Suspense>
      ) : (
        <Hold id="experience" />
      )}
      {shown > 6 ? (
        <Suspense fallback={<Hold id="faq" />}>
          <Faq />
        </Suspense>
      ) : (
        <Hold id="faq" />
      )}
    </main>
  )
}
