'use client'

import { motion } from 'framer-motion'
import { PROJECTS, PROCESS_LABELS } from '@/lib/content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export default function WorkFrame() {
  return (
    <div className="frame-inner" style={{ padding: '32px 40px', gap: 0 }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <p className="frame-number">02 / 06</p>
          <h2 className="frame-title" style={{ marginBottom: 0 }}>Selected Work</h2>
        </div>
        <a
          href="https://behance.net/kishanspatel"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 10, color: '#484541', letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase', paddingBottom: 2 }}
        >
          Full portfolio on Behance ↗
        </a>
      </motion.div>

      <motion.div
        className="frame-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Process legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
      >
        <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase' }}>PROCESS</p>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {PROCESS_LABELS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                fontSize: 10, color: '#484541', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 2, padding: '2px 7px', letterSpacing: '0.04em',
              }}>
                {label}
              </span>
              {i < PROCESS_LABELS.length - 1 && <span style={{ fontSize: 9, color: '#222' }}>→</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Projects */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflow: 'hidden' }}
      >
        {PROJECTS.map((proj, idx) => (
          <motion.div
            key={proj.id}
            variants={cardVariant}
            whileHover={{
              borderColor: 'rgba(200,169,110,0.22)',
              background: 'rgba(200,169,110,0.035)',
              transition: { duration: 0.2 },
            }}
            style={{
              background: 'rgba(255,255,255,0.018)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 4,
              padding: '18px 20px',
              display: 'flex',
              gap: 24,
            }}
          >
            {/* Left: index + meta */}
            <div style={{ width: 200, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 32, fontWeight: 700, color: '#1a1918',
                  fontFamily: 'var(--font-display)', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e8e2d8', lineHeight: 1.2, marginBottom: 4 }}>
                {proj.title}
              </h3>
              <p style={{ fontSize: 10.5, color: '#585450', lineHeight: 1.5, marginBottom: 10 }}>
                {proj.subtitle}
              </p>
              <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                {proj.year}
              </p>
              <p style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: '0.04em' }}>
                {proj.scope}
              </p>

              {/* Animated process bar */}
              <div style={{ display: 'flex', gap: 3, marginTop: 14 }}>
                {PROCESS_LABELS.map((label, i) => (
                  <div key={label} style={{ flex: 1, position: 'relative', height: 3, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
                    {proj.process[i] && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.6 + idx * 0.12 + i * 0.08 }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: '#c8a96e', borderRadius: 2,
                          transformOrigin: 'left center',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                {PROCESS_LABELS.map((label, i) => (
                  <div key={label} style={{ flex: 1, fontSize: 8, color: proj.process[i] ? '#484541' : '#1e1e1e', letterSpacing: '0.04em' }}>
                    {label[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: contributions */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
                CONTRIBUTIONS
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {proj.contributions.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', gap: 10, fontSize: 12, color: '#686460', lineHeight: 1.6 }}
                  >
                    <span style={{
                      flexShrink: 0, marginTop: 2, width: 16, height: 16,
                      border: '1px solid rgba(200,169,110,0.2)',
                      borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, color: '#c8a96e', fontVariantNumeric: 'tabular-nums',
                    }}>
                      {i + 1}
                    </span>
                    {c}
                  </motion.li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
                {proj.tags.map((tag, ti) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 + idx * 0.1 + ti * 0.04 }}
                    style={{
                      fontSize: 10, color: '#3a3a3a',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 3, padding: '2px 8px', letterSpacing: '0.04em',
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
