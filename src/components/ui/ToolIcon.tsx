import type { IconType } from 'react-icons'
import {
  SiReact, SiLaravel, SiMysql, SiFigma, SiJavascript, SiPhp, SiPython, SiGithub, SiVercel,
  SiNotion, SiSketch, SiClaude, SiGooglegemini, SiHtml5, SiCss, SiVite, SiGoogleforms,
  SiCplusplus, SiOpenjdk, SiGoogle,
} from 'react-icons/si'
import s from './ToolIcon.module.css'

const icons: Record<string, IconType> = {
  React: SiReact, Laravel: SiLaravel, MySQL: SiMysql, Figma: SiFigma, JavaScript: SiJavascript,
  PHP: SiPhp, Python: SiPython, GitHub: SiGithub, Vercel: SiVercel, Notion: SiNotion,
  Sketch: SiSketch, Claude: SiClaude, 'Claude Code': SiClaude, 'Claude (Claude Code)': SiClaude,
  Gemini: SiGooglegemini, HTML: SiHtml5, CSS: SiCss, Vite: SiVite, 'Google Forms': SiGoogleforms,
  'C++': SiCplusplus, Java: SiOpenjdk, 'Figma AI': SiFigma, FigJam: SiFigma, Google: SiGoogle,
}

// Adobe and ChatGPT logos are not in the icon pack, so they get a small text badge.
const badges: Record<string, string> = {
  'Adobe Illustrator': 'Ai', Illustrator: 'Ai', 'Adobe Photoshop': 'Ps', Photoshop: 'Ps', ChatGPT: 'GPT', SQL: 'SQL',
}

export function ToolIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = icons[name]
  if (Icon) return <Icon size={size} aria-hidden="true" />
  const badge = badges[name]
  if (badge) return <span className={s.badge} style={{ fontSize: size * 0.55 }} aria-hidden="true">{badge}</span>
  return null
}

export function ToolChip({ name }: { name: string }) {
  return (
    <span className={s.chip}>
      <ToolIcon name={name} size={15} />
      {name}
    </span>
  )
}
