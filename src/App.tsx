import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SmoothScroll } from './lib/smooth-scroll'
import { useScroll } from './lib/scroll-context'
import { ReadyContext } from './lib/ready'
import { Preloader } from './components/layout/Preloader'
import { shouldShowIntro } from './lib/intro'
import { afterFirstInteraction } from './lib/defer'
import { openSections, TOTAL_SECTIONS, useSectionCount } from './lib/sections'
import { Nav } from './components/layout/Nav'
import { Cursor } from './components/ui/Cursor'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { AmbientGlow } from './components/ui/AmbientGlow'
import { PageCurtain } from './components/layout/PageCurtain'
import Home from './pages/Home'

const ProjectPage = lazy(() => import('./pages/Project'))
const Contact = lazy(() => import('./components/sections/Contact').then((m) => ({ default: m.Contact })))
const AdminPage = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Scroll to the top on every page change (the home page handles its own section jumps). */
function ScrollToTop() {
  const { pathname } = useLocation()
  const { scrollTo } = useScroll()
  useEffect(() => {
    scrollTo(0, { immediate: true })
  }, [pathname, scrollTo])
  return null
}

function Routed() {
  const location = useLocation()
  const below = useSectionCount() >= TOTAL_SECTIONS
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!isAdmin &&
          (below ? (
            <Suspense fallback={<div id="contact" data-hold style={{ minHeight: '60vh' }} aria-hidden="true" />}>
              <Contact />
            </Suspense>
          ) : (
            <div id="contact" data-hold style={{ minHeight: '60vh' }} aria-hidden="true" />
          ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  // With no intro to wait for, the page is ready on the very first render (no hidden first frame)
  const [ready, setReady] = useState(() => !shouldShowIntro())
  // Sections below the first screen: shown one by one shortly after the first paint, or all at once as
  // soon as the visitor scrolls or touches the page.
  useEffect(() => {
    const timer = window.setTimeout(() => openSections(), 1200)
    const cancel = afterFirstInteraction(() => openSections({ all: true }), 600_000)
    return () => {
      window.clearTimeout(timer)
      cancel()
    }
  }, [])
  return (
    <SmoothScroll>
      <ReadyContext.Provider value={ready}>
        <a className="skip-link" href="#main">Skip to content</a>
        <AmbientGlow />
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <PageCurtain />
        <Cursor />
        <Preloader onDone={() => setReady(true)} />
        <Nav />
        <ScrollToTop />
        <Routed />
      </ReadyContext.Provider>
    </SmoothScroll>
  )
}
