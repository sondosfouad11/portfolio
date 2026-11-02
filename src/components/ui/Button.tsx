import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from './Magnetic'
import s from './Button.module.css'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  external?: boolean
  download?: boolean
  cursor?: string
  magnetic?: boolean
}

export function Button({
  children, href, onClick, variant = 'primary', external, download, cursor, magnetic = true,
}: Props) {
  const cls = `${s.btn} ${variant === 'primary' ? s.primary : s.ghost}`
  const inner = (
    <>
      <span>{children}</span>
      <ArrowUpRight size={18} className={s.arrow} aria-hidden="true" />
    </>
  )
  const el = href ? (
    <a
      className={cls}
      href={href}
      data-cursor={cursor}
      download={download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  ) : (
    <button className={cls} type="button" onClick={onClick} data-cursor={cursor}>
      {inner}
    </button>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
