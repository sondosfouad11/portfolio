import { useState } from 'react'
import { Code2, Palette } from 'lucide-react'
import { profile } from '../../data/profile'
import { useScroll } from '../../lib/scroll-context'
import { FadeUp, RevealWords } from '../ui/Reveal'
import s from './About.module.css'

const index = [
  { n: '01', label: 'About', id: 'about' },
  { n: '02', label: 'What I do', id: 'services' },
  { n: '03', label: 'Work', id: 'work' },
  { n: '04', label: 'Skills', id: 'skills' },
  { n: '05', label: 'Experience', id: 'experience' },
  { n: '06', label: 'Contact', id: 'contact' },
]

const hats = {
  dev: {
    title: 'The Engineer',
    text: 'React and Laravel apps, SQL databases, clean reusable components.',
    icon: Code2,
  },
  design: {
    title: 'The Designer',
    text: 'User flows, wireframes, prototypes, brand identity and marketing visuals.',
    icon: Palette,
  },
} as const

export function About() {
  const { scrollTo } = useScroll()
  const [hat, setHat] = useState<keyof typeof hats | null>(null)

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className={`container ${s.grid}`}>
        <FadeUp className={s.indexCol}>
          <p className="eyebrow">Portfolio index</p>
          <ol className={s.index}>
            {index.map((it) => (
              <li key={it.id}>
                <button type="button" onClick={() => scrollTo(`#${it.id}`)} data-cursor="Go">
                  <span>{it.n}</span>
                  {it.label}
                </button>
              </li>
            ))}
          </ol>
        </FadeUp>

        <div className={s.main}>
          <p className="eyebrow">01 — About</p>
          <RevealWords
            as="h2"
            className={s.heading}
            text="Designing and building things that *make* sense."
          />
          <div className={s.bio}>
            {profile.bio.map((p) => (
              <FadeUp key={p}>
                <p>{p}</p>
              </FadeUp>
            ))}
          </div>

          <div className={s.hats} onPointerLeave={() => setHat(null)}>
            {(Object.keys(hats) as (keyof typeof hats)[]).map((key) => {
              const h = hats[key]
              const Icon = h.icon
              return (
                <button
                  key={key}
                  type="button"
                  className={`${s.hat} ${hat === key ? s.on : ''} ${hat && hat !== key ? s.off : ''}`}
                  onPointerEnter={() => setHat(key)}
                  onFocus={() => setHat(key)}
                  onBlur={() => setHat(null)}
                >
                  <Icon size={26} aria-hidden="true" />
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </button>
              )
            })}
          </div>

          <dl className={s.facts}>
            {profile.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
