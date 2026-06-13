'use client'

import { motion } from 'framer-motion'

const SERVICES = [
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
    description: 'Pixel-precise interfaces grounded in system-level thinking. I build reusable components and maintain design consistency at scale.',
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function ServicesFrame() {
  return (
    <div className="frame-inner" style={{ padding: '32px 36px', gap: 0 }}>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <p className="frame-number">03 / 06</p>
          <h2 className="frame-title" style={{ marginBottom: 0 }}>Services</h2>
        </div>
        <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.9, textAlign: 'right' }}>
          PRODUCT<br />DESIGNER
        </p>
      </motion.div>

      <motion.div
        className="frame-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {SERVICES.map(service => (
          <motion.div
            key={service.num}
            variants={cardVariant}
            whileHover={{
              borderColor: 'rgba(200,169,110,0.25)',
              background: 'rgba(200,169,110,0.04)',
              y: -2,
              transition: { duration: 0.2 },
            }}
            style={{
              background: 'rgba(255,255,255,0.018)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 4,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
            }}
          >
            {/* Watermark number */}
            <span style={{
              position: 'absolute', bottom: -8, right: 12,
              fontSize: 64, fontWeight: 800, color: '#151412',
              fontFamily: 'var(--font-display)', lineHeight: 1,
              pointerEvents: 'none', userSelect: 'none',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {service.num}
            </span>

            <div>
              <p style={{ fontSize: 9, color: '#c8a96e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
                {service.focus}
              </p>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e8e2d8', letterSpacing: '-0.01em' }}>
                {service.title}
              </h3>
            </div>

            <p style={{ fontSize: 11.5, color: '#686460', lineHeight: 1.65, flex: 1 }}>
              {service.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {service.deliverables.map(d => (
                <span key={d} style={{
                  fontSize: 10, color: '#3e3c39',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 3, padding: '2px 7px', letterSpacing: '0.03em',
                }}>
                  {d}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
