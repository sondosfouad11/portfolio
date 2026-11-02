import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { FaBehance, FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import { profile } from '../../data/profile'
import { safeStorage } from '../../lib/hooks'
import { useScroll } from '../../lib/scroll-context'
import { useFocusTrap } from '../../lib/useFocusTrap'
import s from './Nav.module.css'

const links = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

const store = safeStorage('local')
// The site always opens black (dark). Only a choice made with the sun/moon button is remembered.
// The key is versioned: changing it forgets older saved choices (e.g. from testing the light mode).
const THEME_KEY = 'theme-v2'

export function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { scrollTo } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useFocusTrap(menuRef, open)
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'),
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock page scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    store.set(THEME_KEY, next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#080808' : '#F4F2F2')
  }

  const go = (id: string) => {
    setOpen(false)
    if (pathname !== '/' && !document.getElementById(id)) {
      navigate('/', { state: { scrollTo: id } })
    } else {
      // Wait a tick so the page can unlock scrolling after the menu closes.
      setTimeout(() => scrollTo(`#${id}`, { offset: -20 }), 50)
    }
  }

  return (
    <>
      <header className={`${s.wrap} ${scrolled ? s.scrolled : ''}`}>
        <nav className={s.pill} aria-label="Main">
          <Link to="/" className={s.logo} title="Home" data-cursor="Home" onClick={() => scrollTo(0)}>
            {profile.initials}<span>.</span>
          </Link>

          <ul className={s.links}>
            {links.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => go(l.id)}>
                  <span className="u-draw">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={s.icon}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button type="button" className={s.cta} onClick={() => go('contact')}>
            Let’s talk
          </button>

          <button
            type="button"
            className={`${s.icon} ${s.burger}`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className={s.overlay}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className={s.sheetTop}>
              <Link to="/" className={s.logo} onClick={() => { setOpen(false); scrollTo(0) }}>
                {profile.initials}<span>.</span>
              </Link>
              <button type="button" className={s.close} onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            <ol className={s.mobileLinks}>
              {[...links, { id: 'experience', label: 'Experience' }].map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + i * 0.06, duration: 0.45 }}
                >
                  <button type="button" onClick={() => go(l.id)}>
                    <small>0{i + 1}</small>
                    <span>{l.label}</span>
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </ol>

            <motion.div
              className={s.sheetBottom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <a href={`mailto:${profile.email}`} className={s.mail}>{profile.email}</a>
              <div className={s.sheetRow}>
                <ul className={s.socials}>
                  {[
                    { label: 'LinkedIn', href: profile.links.linkedin, Icon: FaLinkedinIn },
                    { label: 'GitHub', href: profile.links.github, Icon: FaGithub },
                    { label: 'Behance', href: profile.links.behance, Icon: FaBehance },
                    { label: 'WhatsApp', href: profile.whatsapp, Icon: FaWhatsapp },
                  ].map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                        <Icon size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
                <button type="button" className={s.mobileTheme} onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
