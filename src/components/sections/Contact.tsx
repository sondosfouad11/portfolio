import { useState } from 'react'
import { ArrowUp, Check, Copy } from 'lucide-react'
import { FaBehance, FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import { profile } from '../../data/profile'
import { useScroll as useSmoothScroll } from '../../lib/scroll-context'
import { Button } from '../ui/Button'
import { RevealWords } from '../ui/Reveal'
import { ContactForm } from './ContactForm'
import s from './Contact.module.css'

const YEAR = new Date().getFullYear()

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: FaLinkedinIn },
  { label: 'GitHub', href: profile.links.github, Icon: FaGithub },
  { label: 'Behance', href: profile.links.behance, Icon: FaBehance },
  { label: 'WhatsApp', href: profile.whatsapp, Icon: FaWhatsapp },
]

export function Contact() {
  const { scrollTo } = useSmoothScroll()
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <footer className={s.footer} id="contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="eyebrow">07 — Contact</p>
        <RevealWords
          as="h2"
          className={s.heading}
          text="Let’s build something that feels *great* to use."
        />

        <div className={s.grid}>
          <div className={s.direct}>
            <p className={s.lead}>
              Have an idea, a project or a job in mind? Send me a message. I usually reply quickly.
            </p>

            <div className={s.emailRow}>
              <a href={`mailto:${profile.email}`} className={`u-draw is-on ${s.email}`}>
                {profile.email}
              </a>
              <button type="button" className={s.copy} onClick={copyEmail} data-cursor="Copy">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className={s.actions}>
              <Button href={profile.whatsapp} external cursor="Chat">
                WhatsApp me
              </Button>
              <Button href={`mailto:${profile.email}`} variant="ghost">
                Send email
              </Button>
            </div>

            <ul className={s.socials}>
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor={label}>
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>

      <div className={`container ${s.bottom}`}>
        <p>
          © {YEAR} {profile.name}
        </p>
        <ul className={s.miniSocials} aria-label="Social links">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon size={16} />
              </a>
            </li>
          ))}
        </ul>
        <button type="button" className={s.top} onClick={() => scrollTo(0)} data-cursor="Top">
          Back to top <ArrowUp size={16} className={s.topArrow} />
        </button>
      </div>
    </footer>
  )
}
