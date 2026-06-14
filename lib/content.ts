/**
 * SINGLE SOURCE OF TRUTH for portfolio content shared by the canvas frames
 * (components/frames/*.tsx) and the mobile film reel (components/mobile/*).
 * Both import from here — edit a stat, project, or contact detail in ONE place.
 *
 * NOTE: the presentation deck (components/PresentationSlides.tsx) keeps its OWN
 * curated copy and presentation-only structures (module grid, CSS mockups) and
 * is NOT wired to this module yet — see CLAUDE.md ("THREE separate render paths").
 * Canonical facts sourced from the frames, app/resume/page.tsx, and me/details.md.
 */

export interface MobileSection {
  id: string
  label: string
}

/** Reel order — mirrors lib/frames.ts ORDER so the experience matches desktop. */
export const SECTIONS: MobileSection[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'experience', label: 'Experience' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
]

export const PROFILE = {
  name: 'Kishan S. Patel',
  firstName: 'Kishan',
  lastName: 'S. Patel',
  role: 'Product Designer',
  company: 'Motadata',
  product: 'ObserveOps',
  location: 'Ahmedabad, Gujarat, India',
  photo: '/kishan-profile.png',
  bio: 'Product designer at Motadata, working on ObserveOps — an IT infrastructure monitoring platform used by enterprises. My work spans end-to-end: research, information architecture, high-fidelity UI, and design-system maintenance.',
}

export interface Stat {
  val: number
  suffix: string
  unit: string
  label: string
}

export const STATS: Stat[] = [
  { val: 4, suffix: '+', unit: 'yrs', label: 'At Motadata' },
  { val: 20, suffix: '+', unit: 'mod', label: 'Modules shipped' },
  { val: 5, suffix: '', unit: 'tools', label: 'Design tools' },
]

/** Convenience: the tenure stat as a display string, e.g. "4+". */
export const TENURE = `${STATS[0].val}${STATS[0].suffix}`

export const TOOLS = ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'After Effects']

export const SPECS = [
  'Product Design', 'UX Research', 'Dashboard UI',
  'Design Systems', 'Enterprise UX', 'Information Architecture',
]

export const CURRENT_ROLE = {
  company: 'Motadata',
  title: 'Product Designer',
  period: 'Jul 2022 — Present',
  blurb: 'Sole UX designer for ObserveOps. Designed the RUM Module end-to-end, plus Metric Explorer, Dashboard system, Global Filter, Topology, and more.',
}

export interface Project {
  id: string
  index: string
  title: string
  subtitle: string
  year: string
  scope: string
  process: boolean[] // [Research, Wireframe, Design, Ship]
  contributions: string[]
  tags: string[]
}

export const PROCESS_LABELS = ['Research', 'Wireframe', 'Design', 'Ship']

export const PROJECTS: Project[] = [
  {
    id: 'rum',
    index: '01',
    title: 'RUM Module',
    subtitle: 'Real User Monitoring — ObserveOps',
    year: '2023',
    scope: 'End-to-end · Full module',
    process: [true, true, true, true],
    contributions: [
      'Led user research with engineering and product stakeholders to define data needs',
      'Designed complete information architecture — session replay, performance metrics, error tracking',
      'Built the UI from scratch: dashboards, drill-down flows, alert configurations',
    ],
    tags: ['Research-led', 'Dashboard', 'Data Viz', 'Enterprise'],
  },
  {
    id: 'metric',
    index: '02',
    title: 'Metric Explorer',
    subtitle: 'Query & Visualisation Redesign — ObserveOps',
    year: '2023',
    scope: 'Redesign · Existing module',
    process: [false, true, true, true],
    contributions: [
      'Audited pain points in the existing query builder through stakeholder walkthroughs',
      'Simplified the complex multi-metric query interface with progressive disclosure',
      'Redesigned chart types, time-range selectors, and comparison views',
    ],
    tags: ['Redesign', 'Query UI', 'Data Viz', 'Figma'],
  },
  {
    id: 'dashboard',
    index: '03',
    title: 'Dashboard System',
    subtitle: 'Create Dashboard · Add Widget · Global Filter',
    year: '2022 — 2024',
    scope: 'Feature suite · Ongoing',
    process: [true, true, true, true],
    contributions: [
      'Designed "Create Dashboard" and "Add New Widget" flows with template-based creation',
      'Built the Global Filter panel and Search system for cross-module navigation',
      'Covered Topology map views and Trap log management interfaces',
    ],
    tags: ['System Design', 'Widget Library', 'Navigation', 'Topology'],
  },
]

export interface Service {
  num: string
  title: string
  focus: string
  description: string
  deliverables: string[]
}

export const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Product UX Design',
    focus: 'Enterprise · SaaS · Dashboard UI',
    description: 'End-to-end product design for complex data-heavy platforms — from IA and user flows to polished high-fidelity interfaces.',
    deliverables: ['User flows', 'Wireframes', 'Hi-fi UI', 'Component library'],
  },
  {
    num: '02',
    title: 'UX Research',
    focus: 'Interviews · Audit · Synthesis',
    description: 'Structured research that turns stakeholder ambiguity into clear design direction — interviews, journey maps, competitive audits.',
    deliverables: ['User interviews', 'Journey maps', 'Personas', 'Design brief'],
  },
  {
    num: '03',
    title: 'UI & Visual Design',
    focus: 'Figma · Design Systems · Specs',
    description: 'Pixel-precise interfaces grounded in system-level thinking. I build reusable components and maintain consistency at scale.',
    deliverables: ['Design system', 'Mockups', 'Dev specs', 'Assets'],
  },
  {
    num: '04',
    title: 'Prototyping & Handoff',
    focus: 'Figma · Interactive · Specs',
    description: 'Interactive Figma prototypes for stakeholder validation and usability testing, with annotated developer handoff.',
    deliverables: ['Click prototypes', 'Usability tests', 'Annotations', 'Dev ready'],
  },
]

export interface Step {
  number: string
  label: string
  focus: string
  description: string
  output: string
}

export const STEPS: Step[] = [
  {
    number: '01', label: 'Research', focus: 'Understand',
    description: 'User interviews, stakeholder walkthroughs, competitive audits. Turn ambiguity into a clear problem statement.',
    output: 'Problem brief · Journey map',
  },
  {
    number: '02', label: 'Information Architecture', focus: 'Structure',
    description: 'Define the data model and navigation hierarchy before touching visual design. Structure first, aesthetics second.',
    output: 'IA map · User flows',
  },
  {
    number: '03', label: 'Wireframe', focus: 'Validate',
    description: 'Low-fidelity flows tested with stakeholders to validate structure and edge cases without wasting polish.',
    output: 'Lo-fi prototype · Feedback',
  },
  {
    number: '04', label: 'High-Fidelity UI', focus: 'Design',
    description: 'Pixel-precise Figma screens with system-level component thinking — consistent, scalable, and dev-ready.',
    output: 'Hi-fi screens · Component library',
  },
  {
    number: '05', label: 'Handoff & Ship', focus: 'Deliver',
    description: 'Annotated dev specs, interaction notes, asset exports. Stay available through implementation for pixel-perfect output.',
    output: 'Specs · Dev annotation · QA',
  },
]

export interface TimelineItem {
  role: string
  company: string
  period: string
  type: string
  accent: boolean
  live: boolean
  bullets: string[]
}

export const TIMELINE: TimelineItem[] = [
  {
    role: 'Product Designer',
    company: 'Motadata',
    period: 'Jul 2022 — Present',
    type: 'Full-time',
    accent: true,
    live: true,
    bullets: [
      'Sole UX designer on ObserveOps — IT infrastructure monitoring platform',
      'Designed the full RUM Module from research to final UI delivery',
      'Redesigned Metric Explorer, Dashboard creation, Global Filter, Topology, Trap',
      'Maintains and evolves the product design system in Figma',
    ],
  },
  {
    role: 'UI Designer',
    company: 'Internship · Ahmedabad',
    period: 'Feb 2022 — Apr 2022',
    type: 'Internship',
    accent: false,
    live: false,
    bullets: [
      'Completed a 2.5-month UI design internship',
      'Worked on interface design and visual component creation',
    ],
  },
  {
    role: 'Graphic Designer',
    company: 'Freelance',
    period: 'Dec 2021 — Feb 2022',
    type: 'Freelance',
    accent: false,
    live: false,
    bullets: ['Two months of freelance graphic design before moving to UI/UX'],
  },
  {
    role: 'MSc (CA & IT)',
    company: 'K. S. School of Business Management · Gujarat University',
    period: '2018 — 2023',
    type: 'Education',
    accent: false,
    live: false,
    bullets: [
      '5-year integrated course in Computer Applications & Information Technology',
      'Self-taught Photoshop, Illustrator, Adobe XD, and Figma during this period',
    ],
  },
]

/** Experience-sidebar skill groups (canvas-only). */
export const SKILLS_MAP = [
  { category: 'Design', items: TOOLS },
  { category: 'Process', items: ['UX Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Handoff'] },
]

export interface SkillDomain {
  area: string
  color: string
  icon: string
  note: string
  skills: string[]
}

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    area: 'Research & Strategy', color: '#7ee8a8', icon: '◎', note: 'How I define the problem',
    skills: ['Stakeholder Interviews', 'Heuristic Audits', 'Competitive Analysis', 'Journey Mapping', 'Usability Testing', 'Scope Definition'],
  },
  {
    area: 'UI & Visual Design', color: '#c8a96e', icon: '◆', note: 'How I build the interface',
    skills: ['High-fidelity Screens', 'Data Visualisation', 'Dashboard Layouts', 'Typography', 'Icon Design', 'Responsive UI'],
  },
  {
    area: 'Systems & Craft', color: '#7eb8e8', icon: '▣', note: 'How I scale design',
    skills: ['Component Libraries', 'Design Tokens', 'Style Guides', 'Dev Handoff', 'Motion Guidelines', 'Documentation'],
  },
  {
    area: 'Prototyping & Motion', color: '#b87ee8', icon: '▶', note: 'How I communicate intent',
    skills: ['Interactive Figma Flows', 'Micro-interactions', 'After Effects', 'Clickable Prototypes', 'Annotated Specs'],
  },
]

export const METHODS = ['Design Thinking', 'Agile / Scrum', 'Atomic Design', 'JTBD', 'Lean UX']

export const AI_TOOLS = [
  { name: 'Claude', color: '#d97757' },
  { name: 'Gemini', color: '#4285F4' },
  { name: 'ChatGPT', color: '#10a37f' },
  { name: 'v0', color: '#ffffff' },
  { name: 'Bolt', color: '#7c3aed' },
]

export interface ContactLink {
  label: string
  value: string
  href: string
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'Email', value: 'kishanpatel4999@gmail.com', href: 'mailto:kishanpatel4999@gmail.com' },
  { label: 'Behance', value: 'behance.net/kishanspatel', href: 'https://behance.net/kishanspatel' },
  { label: 'LinkedIn', value: 'linkedin.com/in/kishanspatel49', href: 'https://linkedin.com/in/kishanspatel49' },
]

export const CONTACT_BLURB =
  "Have a product to design or a UX problem to solve? Let's talk. I'm particularly comfortable with data-heavy enterprise platforms."
