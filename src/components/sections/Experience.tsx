import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { courses, education, languages } from '../../data/profile'
import { timeline } from '../../data/content'
import { FadeUp, RevealWords } from '../ui/Reveal'
import s from './Experience.module.css'

export function Experience() {
  const ref = useRef<HTMLOListElement>(null)
  // The vertical line draws itself as the list scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <p className="eyebrow">05 — Experience</p>
        <RevealWords as="h2" className={s.heading} text="Where I’ve *worked*." />

        <ol className={s.timeline} ref={ref}>
          <motion.span className={s.line} style={{ scaleY: draw }} aria-hidden="true" />
          {timeline.map((t) => (
            <li key={t.company} className={s.entry}>
              <i className={s.node} aria-hidden="true" />
              <FadeUp>
                <p className={s.period}>{t.period}</p>
                <h3>{t.title}</h3>
                <p className={s.company}>
                  {t.company} <span>· {t.place}</span>
                </p>
                <ul className={s.points}>
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </FadeUp>
            </li>
          ))}
        </ol>

        <div className={s.cards}>
          <FadeUp className={s.card}>
            <p className="eyebrow">Education</p>
            <h3>{education.degree}</h3>
            <p>{education.school}</p>
            <p className={s.muted}>
              {education.period} · {education.note}
            </p>
          </FadeUp>

          <FadeUp className={s.card} delay={0.08}>
            <p className="eyebrow">Courses</p>
            <ul className={s.courses}>
              {courses.map((c) => (
                <li key={c.title}>
                  <strong>{c.title}</strong>
                  <span>
                    {c.place} · {c.date}
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp className={s.card} delay={0.16}>
            <p className="eyebrow">Languages</p>
            <ul className={s.courses}>
              {languages.map((l) => (
                <li key={l.name}>
                  <strong>{l.name}</strong>
                  <span>{l.level}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
