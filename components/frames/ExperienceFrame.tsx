'use client'

import { motion } from 'framer-motion'

const TIMELINE = [
  {
    role: 'Product Designer',
    company: 'Motadata',
    period: 'Jul 2022 — Present',
    type: 'Full-time',
    accent: true,
    live: true,
    bullets: [
      'Sole UX designer on ObserveOps — IT infrastructure monitoring platform',
      'Designed full RUM Module from research to final UI delivery',
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
      'Completed 2.5-month UI design internship',
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
    bullets: [
      'Two months freelance graphic design before moving to UI/UX',
    ],
  },
  {
    role: 'MSC CA & IT',
    company: 'K S School of Business Management · Gujarat University',
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

const SKILLS_MAP = [
  { category: 'Design', items: ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'After Effects'] },
  { category: 'Process', items: ['UX Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Handoff'] },
]

export default function ExperienceFrame() {
  return (
    <div className="frame-inner" style={{ padding: '32px 36px', gap: 0 }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <p className="frame-number">05 / 06</p>
          <h2 className="frame-title" style={{ marginBottom: 0 }}>Experience</h2>
        </div>
        <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.9, textAlign: 'right' }}>
          3+ YEARS<br />FULL-TIME
        </p>
      </motion.div>

      <motion.div
        className="frame-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <div style={{ display: 'flex', gap: 28, flex: 1, overflow: 'hidden' }}>

        {/* Timeline */}
        <div className="frame-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: 14, paddingBottom: 20 }}
            >
              {/* Timeline gutter */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  {/* Outer ring for current role */}
                  {item.accent && (
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        inset: -4,
                        borderRadius: '50%',
                        background: 'rgba(200,169,110,0.3)',
                      }}
                    />
                  )}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4, position: 'relative',
                    background: item.accent ? '#c8a96e' : '#282520',
                    border: `2px solid ${item.accent ? '#c8a96e' : '#2a2a2a'}`,
                  }} />
                </div>
                {i < TIMELINE.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: 1, flex: 1, background: '#1e1e1e', marginTop: 6, transformOrigin: 'top' }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: item.accent ? '#e8e2d8' : '#a09b93', lineHeight: 1.3 }}>
                        {item.role}
                      </h3>
                      {item.live && (
                        <span className="live-dot" title="Currently working here" />
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: item.accent ? '#c8a96e' : '#484541', marginTop: 2 }}>{item.company}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: '#3a3a3a', display: 'block', letterSpacing: '0.02em' }}>{item.period}</span>
                    <span style={{
                      fontSize: 9, color: item.type === 'Full-time' ? '#c8a96e' : '#333',
                      border: `1px solid ${item.type === 'Full-time' ? 'rgba(200,169,110,0.2)' : '#1e1e1e'}`,
                      borderRadius: 3, padding: '1px 5px',
                      display: 'inline-block', marginTop: 3, letterSpacing: '0.08em',
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {item.bullets.map((b, j) => (
                    <li key={j} style={{ display: 'flex', gap: 7, fontSize: 11, color: '#585450', lineHeight: 1.55 }}>
                      <span style={{ color: '#2a2a2a', flexShrink: 0, marginTop: 1 }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: skills + stat */}
        <div style={{ width: 148, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tenure stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '14px 16px',
              background: 'rgba(200,169,110,0.05)',
              border: '1px solid rgba(200,169,110,0.1)',
              borderRadius: 4,
            }}
          >
            <p style={{ fontSize: 9, color: '#c8a96e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>CURRENT</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#c8a96e', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              3+
            </p>
            <p style={{ fontSize: 10, color: '#484541', marginTop: 3 }}>Years at Motadata</p>
          </motion.div>

          {/* Skills */}
          {SKILLS_MAP.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + ci * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                {cat.category}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cat.items.map(skill => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#575350' }}>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#282520', flexShrink: 0 }} />
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.75 }}
            style={{ marginTop: 'auto' }}
          >
            <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
              BASED IN
            </p>
            <p style={{ fontSize: 12, color: '#585450' }}>Ahmedabad</p>
            <p style={{ fontSize: 10, color: '#333', marginTop: 2 }}>Gujarat, India</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
