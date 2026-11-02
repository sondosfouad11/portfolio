import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../data/types'
import { useFinePointer } from '../../lib/hooks'
import { Cover } from './Cover'
import s from './ProjectCard.module.css'

interface Props {
  project: Project
  index: number
}

/** Card with a 3D tilt and inner image parallax. Whole card is one link to the project page. */
export const ProjectCard = forwardRef<HTMLLIElement, Props>(function ProjectCard({ project, index }, ref) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spx = useSpring(px, { stiffness: 200, damping: 22 })
  const spy = useSpring(py, { stiffness: 200, damping: 22 })
  const rotateY = useTransform(spx, (v) => v * 10)
  const rotateX = useTransform(spy, (v) => v * -10)
  const imgX = useTransform(spx, (v) => v * -16)
  const imgY = useTransform(spy, (v) => v * -16)
  const tilt = fine && !reduce

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <li ref={ref} className={s.item}>
      <motion.div style={tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined} className={s.tilt}>
        <Link
          to={`/work/${project.slug}`}
          className={s.card}
          data-cursor="View"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <div className={s.media}>
            <motion.div className={s.mediaInner} style={tilt ? { x: imgX, y: imgY } : undefined}>
              <Cover project={project} eager={index < 2} />
            </motion.div>
            <span className={`${s.badge} ${project.badge === 'Case study' ? s.case : ''}`}>{project.badge}</span>
          </div>
          <div className={s.meta}>
            <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{project.title}</h3>
              <p>
                {project.typeLabel} · {project.dateLabel}
              </p>
            </div>
            <ArrowUpRight className={s.arrow} size={22} aria-hidden="true" />
          </div>
          <ul className={s.tools} aria-hidden="true">
            {project.tools.slice(0, 3).map((t) => (
              <li key={t}>{t}</li>
            ))}
            {project.tools.length > 3 && <li>+{project.tools.length - 3}</li>}
          </ul>
        </Link>
      </motion.div>
    </li>
  )
})
