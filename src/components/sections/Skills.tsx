import { aiTools, skillGroups } from '../../data/content'
import { FadeUp, RevealWords } from '../ui/Reveal'
import { ToolIcon } from '../ui/ToolIcon'
import s from './Skills.module.css'

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <p className="eyebrow">04 — Skills</p>
        <RevealWords as="h2" className={s.heading} text="Code on one side, *craft* on the other." />

        <div className={s.bento}>
          {skillGroups.map((g, i) => (
            <FadeUp key={g.title} delay={i * 0.05} className={`${s.tile} ${s[g.weight]}`}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>
                    <ToolIcon name={it} size={g.weight === 'lg' ? 20 : 16} />
                    {it}
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}

          <FadeUp className={`${s.tile} ${s.ai}`} delay={0.1}>
            <h3>AI-assisted workflow</h3>
            <p>I use AI tools every day to move faster, and I always review and understand the code myself.</p>
            <ul>
              {aiTools.map((t) => (
                <li key={t}>
                  <ToolIcon name={t} size={18} />
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
