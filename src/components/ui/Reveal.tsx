import { Fragment, type ElementType, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import s from './Reveal.module.css'

const ease = [0.22, 1, 0.36, 1] as const

interface WordsProps {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  /** Words wrapped in *asterisks* render in the serif accent style. */
  accent?: boolean
}

/** Heading whose words slide up out of a mask when it scrolls into view. */
export function RevealWords({ text, as: Tag = 'h2', className, delay = 0, accent = true }: WordsProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text.replace(/\*/g, '')}>
      {words.map((raw, i) => {
        // "*word*" or "*word*." (with trailing punctuation) renders in the serif accent style.
        const m = accent ? raw.match(/^\*(.+)\*([^\w*]*)$/) : null
        const word = m ? m[1] : raw
        const tail = m ? m[2] : ''
        return (
          <Fragment key={i}>
            {i > 0 && ' '}
            <span className={s.mask} aria-hidden="true">
              <motion.span
                className={`${s.word} ${m ? 'serif' : ''}`}
                initial={reduce ? { opacity: 0 } : { y: '110%' }}
                whileInView={reduce ? { opacity: 1 } : { y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease, delay: delay + i * 0.03 }}
              >
                {word}
                {tail && <span className={s.tail}>{tail}</span>}
              </motion.span>
            </span>
          </Fragment>
        )
      })}
    </Tag>
  )
}

export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  // Rise + fade. Pass increasing `delay`s to sibling blocks to stagger them.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}
