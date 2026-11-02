import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import { profile } from '../data/profile'
import { getGallery } from '../lib/assets'
import { Button } from '../components/ui/Button'
import { Cover } from '../components/ui/Cover'
import { Lightbox } from '../components/ui/Lightbox'
import { Parallax } from '../components/ui/Parallax'
import { FadeUp, RevealWords } from '../components/ui/Reveal'
import { ToolChip } from '../components/ui/ToolIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import s from './Project.module.css'

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const close = useCallback(() => setLightbox(null), [setLightbox])

  useDocumentTitle(project ? `${project.title} — Sondos Lasheen` : 'Not found — Sondos Lasheen')
  if (!project) return <NotFound />

  const i = projects.indexOf(project)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]
  const gallery = getGallery(project.assetFolder)
  const built = project.kind === 'built'
  const { live, repo, behance } = project.links

  return (
    <main id="main" className={s.page}>
      <div className="container">
        <Link to="/" className={`u-draw ${s.back}`} data-cursor="Back">
          <ArrowLeft size={18} /> All work
        </Link>

        <header className={s.head}>
          <span className={`${s.badge} ${built ? '' : s.case}`}>{project.badge}</span>
          <RevealWords as="h1" className={s.title} text={project.title} accent={false} />
          <p className={s.subtitle}>{project.subtitle}</p>
        </header>

        <motion.div
          className={s.cover}
          // slides in but never fades: the cover is the largest element (LCP) and must paint right away
          initial={{ y: 32 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Parallax amount={10}>
            <Cover project={project} sizes="(max-width: 1400px) 100vw, 1360px" eager />
          </Parallax>
        </motion.div>

        <dl className={s.meta}>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Year</dt><dd>{project.dateLabel}</dd></div>
          <div><dt>Type</dt><dd>{project.typeLabel}</dd></div>
        </dl>

        <div className={s.body}>
          <FadeUp>
            <h2>Overview</h2>
            <p className={s.overview}>{project.overview}</p>
            <div className={s.actions}>
              {live && <Button href={live} external cursor="Open">Visit live site</Button>}
              {repo && <Button href={repo} external variant="ghost" cursor="Code">View code</Button>}
              {behance && <Button href={behance} external variant={live ? 'ghost' : 'primary'} cursor="Open">View on Behance</Button>}
              {!live && !repo && !behance && (
                <Button href={built ? profile.links.github : profile.links.behance} external variant="ghost">
                  {built ? 'See code on GitHub' : 'More on Behance'}
                </Button>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h2>Tools</h2>
            <ul className={s.tools}>
              {project.tools.map((t) => (
                <li key={t}><ToolChip name={t} /></li>
              ))}
            </ul>
          </FadeUp>
        </div>

        {project.process && (
          <section className={s.process} aria-label="Process">
            <h2>{project.kind === 'brand' ? 'What’s inside' : 'Process'}</h2>
            <ol>
              {project.process.map((step, n) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-6%' }}
                  transition={{ duration: 0.7, delay: n * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span>{String(n + 1).padStart(2, '0')}</span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </section>
        )}

        {live && (
          <section className={s.preview} aria-label="Live preview">
            <h2>Live preview</h2>
            <div className={s.browser}>
              <div className={s.bar}><i /><i /><i /><span>{live.replace(/^https?:\/\//, '')}</span></div>
              <iframe
                src={live}
                title={`${project.title} live preview`}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className={s.gallery} aria-label={project.kind === 'brand' ? 'Brand wall' : 'Gallery'}>
            <h2>{project.kind === 'brand' ? 'Brand wall' : 'Gallery'}</h2>
            <ul className={project.kind === 'brand' ? s.wall : s.grid}>
              {gallery.map((img, n) => (
                <li key={img.src}>
                  <button type="button" onClick={() => setLightbox(n)} data-cursor="Zoom" aria-label={`Open image ${n + 1}`}>
                    <img src={img.src} srcSet={img.srcset} sizes="(max-width: 700px) 100vw, 50vw" width={img.width} height={img.height} alt="" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className={s.pager} aria-label="More projects">
          <Link to={`/work/${prev.slug}`} data-cursor="Prev">
            <small><ArrowLeft size={14} /> Previous</small>
            <strong>{prev.title}</strong>
          </Link>
          <Link to={`/work/${next.slug}`} className={s.nextLink} data-cursor="Next">
            <small>Next <ArrowRight size={14} /></small>
            <strong>{next.title}</strong>
          </Link>
        </nav>
      </div>

      <Lightbox images={gallery} index={lightbox} alt={project.title} onClose={close} onChange={setLightbox} />
    </main>
  )
}
