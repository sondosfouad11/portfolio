import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { faqs } from '../../data/content'
import { RevealWords } from '../ui/Reveal'
import s from './Faq.module.css'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className={`container ${s.grid}`}>
        <div>
          <p className="eyebrow">06 — FAQ</p>
          <RevealWords as="h2" className={s.heading} text="Good *questions*." />
        </div>
        <ul className={s.list}>
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.li
                key={f.q}
                className={s.item}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6%' }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3>
                  <button
                    type="button"
                    className={s.q}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {f.q}
                    <Plus size={22} className={`${s.plus} ${isOpen ? s.rot : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className={s.a}>{f.a}</p>
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
