import { ArrowUpRight } from 'lucide-react'
import { moreWork } from '../../data/projects'
import { profile } from '../../data/profile'
import { getImage } from '../../lib/assets'
import { Parallax } from '../ui/Parallax'
import { FadeUp } from '../ui/Reveal'
import s from './MoreWork.module.css'

/** Compact grid of smaller UI studies. Each card opens the project on Behance. */
export function MoreWork() {
  return (
    <section className={s.section} aria-labelledby="more-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="more-title" className={s.title}>
            More UI studies <span>({moreWork.length})</span>
          </h2>
          <a className={`u-draw ${s.all}`} href={profile.links.behance} target="_blank" rel="noopener noreferrer">
            Everything on Behance <ArrowUpRight size={16} />
          </a>
        </div>

        <ul className={s.grid}>
          {moreWork.map((w, i) => {
            const img = getImage(w.folder, 'cover')
            return (
              <li key={w.folder}>
                <FadeUp delay={(i % 3) * 0.06}>
                  <a href={w.href} target="_blank" rel="noopener noreferrer" className={s.card} data-cursor="Behance">
                    <div className={s.media}>
                      {img && (
                        <Parallax amount={10}>
                          <img
                            src={img.src}
                            srcSet={img.srcset}
                            sizes="(max-width: 700px) 90vw, 33vw"
                            width={img.width}
                            height={img.height}
                            alt=""
                            loading="lazy"
                          />
                        </Parallax>
                      )}
                    </div>
                    <div className={s.meta}>
                      <strong>{w.title}</strong>
                      <span>{w.type}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </div>
                  </a>
                </FadeUp>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
