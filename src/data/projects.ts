import type { Project } from './types'

// To add a project: add an object here, then drop images in raw-assets/<assetFolder>/
// (name the main image "cover.png"/"cover.jpg") and run `npm run assets`.
// Missing links are simply not shown. TODO markers = Sondos must add the real URL.

export const projects: Project[] = [
  {
    slug: 'velora-estates',
    title: 'VELORA ESTATES',
    subtitle: 'Responsive Real Estate Website',
    kind: 'built',
    typeLabel: 'React + Vite',
    badge: 'Designed & Built',
    dateLabel: 'Oct 2026',
    year: 2026,
    overview:
      'A responsive real estate website that shows villas, apartments and contemporary houses. It uses reusable components and a clean, modern UI. Live on Vercel.',
    role: 'Front-end development',
    tools: ['React', 'Vite', 'JavaScript', 'CSS', 'GitHub', 'Vercel'],
    links: {
      live: 'https://veloraestates.vercel.app',
      repo: 'https://github.com/sondosfouad11/velora-estates',
    },
    assetFolder: 'velora-estates',
  },
  {
    slug: 'lumiere-clinic',
    title: 'Lumière Skin & Hair Clinic',
    subtitle: 'Responsive Clinic Website',
    kind: 'built',
    typeLabel: 'React + Vite',
    badge: 'Designed & Built',
    dateLabel: 'Sep 2026',
    year: 2026,
    overview:
      'A responsive clinic website with reusable components and a booking dialog. Live on Vercel.',
    role: 'Front-end development',
    tools: ['React', 'Vite', 'JavaScript', 'CSS', 'GitHub', 'Vercel'],
    links: {
      live: 'https://lumiere-clinic-website.vercel.app',
      repo: 'https://github.com/sondosfouad11/lumiere-clinic',
    },
    assetFolder: 'lumiere-clinic',
  },
  {
    slug: 'bsl',
    title: 'BSL',
    subtitle: 'Brand Identity for a Streetwear Fashion Brand',
    kind: 'brand',
    typeLabel: 'Brand identity',
    badge: 'Case study',
    dateLabel: 'Jan 2026',
    year: 2026,
    overview:
      'A complete brand identity for a streetwear fashion brand. It includes the logo, typography, color palette and brand mockups.',
    role: 'Brand identity design',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    process: ['Logo', 'Typography', 'Color palette', 'Brand mockups'],
    links: {
      behance: 'https://www.behance.net/gallery/243288887/BSL-Brand-Identity-Streetwear',
    },
    assetFolder: 'bsl',
  },
  {
    slug: 'wafid',
    title: 'WAFID',
    subtitle: 'Expat Services Mobile App Case Study',
    kind: 'uiux',
    typeLabel: 'UI/UX · Mobile',
    badge: 'Case study',
    dateLabel: 'Dec 2025',
    year: 2025,
    overview:
      'A mobile app that brings expat services in Egypt (jobs, housing and community) into one place. The case study covers user flows, wireframes, prototyping and interaction design.',
    role: 'UI/UX design',
    tools: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Notion', 'Google Forms'],
    process: ['User flows', 'Wireframes', 'Prototyping', 'Interaction design'],
    links: {
      behance: 'https://www.behance.net/gallery/240937719/WAFID-Expat-Services-Mobile-App',
    },
    assetFolder: 'wafid',
  },
  {
    slug: 'schooltrack',
    title: 'SchoolTrack',
    subtitle: 'Student Management Dashboard UI Design',
    kind: 'uiux',
    typeLabel: 'UI design · Dashboard',
    badge: 'Case study',
    dateLabel: 'Apr 2025',
    year: 2025,
    overview:
      'A dashboard for managing student data. It organizes complex information into a clear, easy-to-use interface.',
    role: 'UI design',
    tools: ['Figma', 'FigJam', 'Notion', 'Google Forms'],
    links: {
      behance: 'https://www.behance.net/gallery/223165091/SchoolTrack-Dashboard-UI-Design',
    },
    assetFolder: 'schooltrack',
  },
  {
    slug: 'highlife',
    title: 'Highlife',
    subtitle: 'Furniture E-Commerce Website Design',
    kind: 'built',
    typeLabel: 'Design + front-end',
    badge: 'Designed & Built',
    dateLabel: 'Dec 2024',
    year: 2024,
    overview:
      'An online furniture store. I designed it and built the front-end, with detailed product pages and imagery, for a smooth browsing and buying experience.',
    role: 'UI design and front-end development',
    tools: ['Figma', 'Adobe Photoshop', 'Notion', 'React', 'HTML', 'CSS', 'JavaScript'],
    links: {
      behance:
        'https://www.behance.net/gallery/214239979/Highlife-Innovative-E-Commerce-for-Furniture',
      // TODO: add live URL and GitHub repo if available
    },
    assetFolder: 'highlife',
  },
  {
    slug: 'gofit',
    title: 'GoFit',
    subtitle: 'Mobile Fitness App Design',
    kind: 'uiux',
    typeLabel: 'UI/UX · Mobile',
    badge: 'Case study',
    dateLabel: 'Nov 2024',
    year: 2024,
    overview:
      'A personalized fitness app that helps users reach their health and fitness goals.',
    role: 'UI/UX design',
    tools: ['Figma', 'Notion'],
    links: {
      behance: 'https://www.behance.net/gallery/212295825/GoFit-Mobile-Fitness-App-Design',
    },
    assetFolder: 'gofit',
  },
  {
    slug: 'glowcare',
    title: 'GlowCare',
    subtitle: 'Beauty & Skincare Website Design',
    kind: 'built',
    typeLabel: 'Design + front-end',
    badge: 'Designed & Built',
    dateLabel: 'Oct 2024',
    year: 2024,
    overview:
      'A skincare, haircare and makeup website. I designed it and built the front-end. I collected user feedback with Google Forms, then made wireframes, prototypes and high-fidelity UI in Figma.',
    role: 'UI/UX design and front-end development',
    tools: ['Figma', 'Notion', 'Google Forms', 'React', 'HTML', 'CSS', 'JavaScript'],
    process: ['User feedback', 'Wireframes', 'Prototypes', 'High-fidelity UI', 'Front-end build'],
    links: {
      behance: 'https://www.behance.net/gallery/209562967/GlowCare-Beauty-Skincare-Website-Design',
      // TODO: add live URL and GitHub repo if available
    },
    assetFolder: 'glowcare',
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

// Smaller UI studies from Behance. Shown as a compact grid that links straight to Behance.
// Covers live in raw-assets/<folder>/cover.png.
export const moreWork = [
  { title: 'Explore Hub', type: 'Events app UI', folder: 'explore-hub', href: 'https://www.behance.net/gallery/205907161/Explore-Hub-Discover-Events-and-Activities-UI-Design' },
  { title: 'Flight Scheduling', type: 'App UI', folder: 'flight-scheduling', href: 'https://www.behance.net/gallery/205907391/Flight-Scheduling-UI-Design' },
  { title: 'CRM Dashboard', type: 'Dashboard UI', folder: 'crm-dashboard', href: 'https://www.behance.net/gallery/205908089/CRM-Dashboard-UI-Design' },
  { title: 'Bank App', type: 'Mobile UI', folder: 'bank-ui', href: 'https://www.behance.net/gallery/206176829/BANK-UI-Design' },
  { title: 'Gaming Controller', type: 'Product showcase UI', folder: 'gaming-ui', href: 'https://www.behance.net/gallery/206177135/Gaming-UI-Design-Dual-Sense-ControllerShowcase' },
  { title: 'Social Media App', type: 'Mobile UI', folder: 'social-media-app', href: 'https://www.behance.net/gallery/206177459/User-Interface-Design-for-Social-MediaApp' },
]
