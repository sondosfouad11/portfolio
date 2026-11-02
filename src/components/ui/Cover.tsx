import type { Project } from '../../data/types'
import { getImage } from '../../lib/assets'
import s from './Cover.module.css'

interface Props {
  project: Project
  sizes?: string
  eager?: boolean
  className?: string
}

/** Project cover image, or a generated gradient with the project's initials when there is no image yet. */
export function Cover({ project, sizes = '(max-width: 900px) 90vw, 560px', eager, className = '' }: Props) {
  const img = getImage(project.assetFolder, 'cover')
  if (img) {
    return (
      <img
        className={`${s.img} ${className}`}
        src={img.src}
        srcSet={img.srcset}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={`${project.title} cover`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }
  const initials = project.title
    .split(/\s+/)
    .filter((w) => /^[\p{L}]/u.test(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className={`${s.placeholder} ${className}`} role="img" aria-label={`${project.title} (cover coming soon)`}>
      <span>{initials}</span>
      <small>{project.subtitle}</small>
    </div>
  )
}
