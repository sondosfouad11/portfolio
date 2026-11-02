import type { FaqItem, SkillGroup, TimelineEntry } from './types'

export const marqueeTop = [
  'React', 'Laravel', 'JavaScript', 'PHP', 'MySQL', 'Figma', 'UI/UX', 'Brand Identity',
]
export const marqueeBottom = [
  'Illustrator', 'Photoshop', 'Prototyping', 'Wireframes', 'GitHub', 'Vercel', 'Notion',
]

export const services = [
  {
    id: 'dev',
    title: 'Full-Stack Development',
    blurb:
      'I build fast, responsive web apps. Front-end with React, back-end with Laravel and SQL.',
    chips: ['Responsive websites', 'Reusable components', 'Laravel back-ends', 'MySQL databases', 'Booking & forms'],
    tools: ['React', 'JavaScript', 'Laravel', 'PHP', 'MySQL', 'HTML', 'CSS', 'GitHub', 'Vercel'],
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    blurb:
      'I turn ideas into clear flows and clean interfaces, and I test them with real people.',
    chips: ['User flows', 'Wireframing', 'Prototyping', 'High-fidelity UI', 'User research & testing'],
    tools: ['Figma', 'FigJam', 'Sketch', 'Notion', 'Google Forms'],
  },
  {
    id: 'brand',
    title: 'Brand & Graphic Design',
    blurb: 'I create brand identities and visuals that look consistent everywhere.',
    chips: ['Brand identity', 'Social media visuals', 'Marketing visuals', 'Promo assets'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
  },
]

export const skillGroups: SkillGroup[] = [
  { title: 'Web', items: ['React', 'HTML', 'CSS', 'Laravel', 'MySQL'], weight: 'lg' },
  { title: 'Languages', items: ['JavaScript', 'PHP', 'SQL', 'Python', 'Java', 'C++'], weight: 'lg' },
  {
    title: 'UI/UX',
    items: ['User Flows', 'Wireframing', 'Prototyping', 'High-Fidelity UI', 'User Research & Testing'],
    weight: 'md',
  },
  { title: 'Design tools', items: ['Figma', 'FigJam', 'Sketch', 'Adobe Photoshop', 'Adobe Illustrator'], weight: 'md' },
  { title: 'Graphic design', items: ['Brand Identity', 'Social Media & Marketing Visuals'], weight: 'sm' },
  { title: 'Tools', items: ['GitHub', 'Vercel', 'Notion'], weight: 'sm' },
]

export const aiTools = ['Claude (Claude Code)', 'ChatGPT', 'Gemini', 'Figma AI']

export const timeline: TimelineEntry[] = [
  {
    period: '2026 – Present',
    place: 'Cairo, Egypt (Remote) · Full-time',
    title: 'Software Engineer',
    company: 'ingoal software',
    points: [
      'Build full-stack web applications with React, Laravel (PHP) and SQL databases.',
      'Troubleshoot and fix code errors during development.',
    ],
  },
  {
    period: 'Jan 2025 – Jan 2026',
    place: 'Full-time',
    title: 'UI/UX & Graphic Designer',
    company: 'MIND for Information Technology & Media',
    points: [
      'Worked on front-end development, turning designs into working interfaces in code.',
      'Designed user flows, wireframes, interactive prototypes and high-fidelity UI in Figma for real-world projects, including a mobile application and an admin dashboard.',
      'Designed brand-consistent social media posts, marketing visuals and promotional assets.',
    ],
  },
]

// TODO (Sondos): the timing and pricing answers are kept general on purpose. Add real numbers if you want.
export const faqs: FaqItem[] = [
  {
    q: 'What can you build for my business?',
    a: 'Responsive websites and web apps: for example a clinic site with online booking, a real estate site, or an online shop. I use React for the front-end and Laravel with SQL for the back-end.',
  },
  {
    q: 'Do you do both design and development?',
    a: 'Yes. I can design the interface in Figma and then build it in code. This means no gap between the design and the final result.',
  },
  {
    q: 'Can you help with my brand?',
    a: 'Yes. I design brand identities (logo, colors, typography, mockups) and visuals for social media and marketing.',
  },
  {
    q: 'How do we start?',
    a: 'Send me a message with a few lines about your idea. I will reply and we can talk about what you need. I work remotely, so we can start from anywhere.',
  },
  {
    q: 'How long does a website take?',
    a: 'It depends on the size of the project. After we talk about what you need, I will give you a clear time estimate.',
  },
  {
    q: 'How much does it cost?',
    a: 'The price depends on what you need. Send me your idea and I will give you a clear quote.',
  },
]
