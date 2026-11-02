import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { services } from '../../data/content'
import { RevealWords } from '../ui/Reveal'
import { ToolChip } from '../ui/ToolIcon'
import s from './Services.module.css'

export function Services() {
  const [open, setOpen] = useState<string>(services[0].id)

  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <p className="eyebrow">02 — What I do</p>
        <RevealWords as="h2" className={s.heading} text="Design it, then *build* it." />

        <ul className={s.list}>
          {services.map((sv, i) => {
            const active = open === sv.id
            return (
              <motion.li
                key={sv.id}
                className={`${s.card} ${active ? s.active : ''}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6%' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3>
                  <button
                    type="button"
                    className={s.head}
                    aria-expanded={active}
                    aria-controls={`svc-${sv.id}`}
                    onClick={() => setOpen(active ? '' : sv.id)}
                    data-cursor={active ? 'Close' : 'Open'}
                  >
                    <span className={s.num}>0{i + 1}</span>
                    <span className={s.title}>{sv.title}</span>
                    <Plus className={s.plus} size={28} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      id={`svc-${sv.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={s.bodyWrap}
                    >
                      <div className={s.body}>
                        <p className={s.blurb}>{sv.blurb}</p>
                        <ul className={s.chips}>
                          {sv.chips.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                        <ul className={s.tools} aria-label="Tools">
                          {sv.tools.map((t) => (
                            <li key={t}>
                              <ToolChip name={t} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
