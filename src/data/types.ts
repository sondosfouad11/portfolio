export type ProjectKind = 'built' | 'uiux' | 'brand'

export interface Project {
  slug: string
  title: string
  /** Short line shown under the title, e.g. "Responsive Real Estate Website" */
  subtitle: string
  kind: ProjectKind
  /** Label for the type badge on cards */
  typeLabel: string
  /** "Designed & Built" or "Case study" */
  badge: 'Designed & Built' | 'Built' | 'Case study'
  dateLabel: string
  year: number
  overview: string
  role: string
  tools: string[]
  /** Only steps that really happened (from the CV). Leave empty to hide the section. */
  process?: string[]
  links: {
    live?: string
    repo?: string
    behance?: string
  }
  /** Key into src/data/assets.generated.json (folder name in raw-assets/). */
  assetFolder: string
}

export interface SkillGroup {
  title: string
  items: string[]
  weight: 'lg' | 'md' | 'sm'
}

export interface TimelineEntry {
  period: string
  place: string
  title: string
  company: string
  points: string[]
}

export interface FaqItem {
  q: string
  a: string
}
