'use client'

import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'

// Animated counter that counts up from 0 on mount
function AnimatedStat({ val, unit, label }: { val: string; unit: string; label: string }) {
  const num = parseInt(val, 10)
  const suffix = val.replace(String(num), '')
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = numRef.current
    if (!node) return
    const ctrl = animate(0, num, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5,
      onUpdate: (v) => { node.textContent = Math.round(v) + suffix },
    })
    return ctrl.stop
  }, [num, suffix])

  return (
    <div style={{
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.025)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          ref={numRef}
          style={{
            fontSize: 24, fontWeight: 700, color: '#c8a96e',
            fontFamily: 'var(--font-display)', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {val}
        </span>
        <span style={{ fontSize: 9, color: '#2e2c29', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {unit}
        </span>
      </div>
      <p style={{ fontSize: 10, color: '#484541', marginTop: 3, letterSpacing: '0.04em' }}>{label}</p>
    </div>
  )
}

const STATS = [
  { val: '3+', unit: 'yrs', label: 'At Motadata' },
  { val: '20+', unit: 'mod', label: 'Modules shipped' },
  { val: '5', unit: 'tools', label: 'Design tools' },
]

const TOOLS = ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'After Effects']

const SPECS = ['Product Design', 'UX Research', 'Dashboard UI', 'Design Systems', 'Enterprise UX', 'Information Architecture']

// Stagger variants
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function AboutFrame() {
  return (
    <motion.div
      className="frame-inner"
      style={{ padding: '32px 36px', gap: 0 }}
      variants={container}
      initial="hidden"
      animate="show"
    >

      {/* Header */}
      <motion.div
        variants={item}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <p className="frame-number">01 / 06</p>
          <h2 className="frame-title" style={{ marginBottom: 0 }}>About</h2>
        </div>
        <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.9, textAlign: 'right' }}>
          AHMEDABAD<br />GUJARAT, IN
        </p>
      </motion.div>

      <motion.div variants={item} className="frame-divider" />

      {/* Two-column body */}
      <div style={{ display: 'flex', gap: 28, flex: 1, overflow: 'hidden' }}>

        {/* Left column */}
        <div style={{ width: 188, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photo with hover zoom */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 148, height: 148, borderRadius: 4, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)', background: '#1a1a1a',
              cursor: 'default',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kishan-profile.png" alt="Kishan S. Patel"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </motion.div>

          {/* Animated stats */}
          <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {STATS.map(s => (
              <AnimatedStat key={s.label} val={s.val} unit={s.unit} label={s.label} />
            ))}
          </motion.div>

          {/* Tools */}
          <motion.div variants={item}>
            <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>
              TOOLS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TOOLS.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#585450' }}>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#2a2a2a', flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Name + title */}
          <motion.div variants={item}>
            <h3 style={{
              fontSize: 30, fontWeight: 700, color: '#f2ede6',
              fontFamily: 'var(--font-display)', textTransform: 'uppercase',
              letterSpacing: '0.05em', lineHeight: 1.05,
            }}>
              KISHAN<br />S. PATEL
            </h3>
            <p style={{ fontSize: 11, color: '#c8a96e', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 6 }}>
              Product Designer
            </p>
          </motion.div>

          {/* Bio */}
          <motion.p variants={item} style={{ fontSize: 12.5, color: '#7a766f', lineHeight: 1.78 }}>
            Product designer at{' '}
            <span style={{ color: '#c8a96e', fontWeight: 600 }}>Motadata</span>
            , working on{' '}
            <span style={{ color: '#a09b93' }}>ObserveOps</span>
            {' '}— an IT infrastructure monitoring platform used by enterprises.
            My work spans end-to-end: research, information architecture, high-fidelity UI,
            and design system maintenance.
          </motion.p>

          {/* Current role card */}
          <motion.div
            variants={item}
            whileHover={{ borderColor: 'rgba(200,169,110,0.28)', background: 'rgba(200,169,110,0.08)' }}
            transition={{ duration: 0.25 }}
            style={{
              padding: '14px 16px',
              background: 'rgba(200,169,110,0.05)',
              border: '1px solid rgba(200,169,110,0.1)',
              borderRadius: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 10, color: '#c8a96e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  MOTADATA
                </p>
                <p style={{ fontSize: 13, color: '#e8e2d8', fontWeight: 600, marginTop: 2 }}>Product Designer</p>
              </div>
              <p style={{ fontSize: 10, color: '#3a3a3a', letterSpacing: '0.04em', marginTop: 2 }}>Jul 2022 — Present</p>
            </div>
            <p style={{ fontSize: 11, color: '#5e5b55', lineHeight: 1.65 }}>
              Sole UX designer for ObserveOps. Designed RUM Module end-to-end,
              Metric Explorer, Dashboard system, Global Filter, Topology, and more.
            </p>
          </motion.div>

          {/* Specialisation chips */}
          <motion.div variants={item}>
            <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 9 }}>
              SPECIALISATION
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {SPECS.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontSize: 11, color: '#585450',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 3, padding: '3px 10px', letterSpacing: '0.02em',
                  }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 4 }}>
            <motion.a
              href="https://behance.net/kishanspatel"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, backgroundColor: '#d4b878' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 12, fontWeight: 600, color: '#080808', background: '#c8a96e',
                padding: '9px 20px', borderRadius: 4, textDecoration: 'none',
                letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block',
              }}
            >
              Behance ↗
            </motion.a>
            <motion.a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 12, fontWeight: 500, color: '#7a766f',
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '9px 20px', borderRadius: 4, textDecoration: 'none', display: 'inline-block',
              }}
            >
              Resume ↗
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
