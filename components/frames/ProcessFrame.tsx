'use client'

import { motion } from 'framer-motion'
import { STEPS } from '@/lib/content'

export default function ProcessFrame() {
  return (
    <div className="frame-inner" style={{ padding: '32px 40px', gap: 0 }}>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <p className="frame-number">04 / 06</p>
          <h2 className="frame-title" style={{ marginBottom: 0 }}>Process</h2>
        </div>
        <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.9, textAlign: 'right' }}>
          5 STAGES<br />END-TO-END
        </p>
      </motion.div>

      <motion.div
        className="frame-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flex: 1, overflow: 'hidden' }}>
        {STEPS.map((step, i) => (
          <div key={step.number} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                borderColor: 'rgba(200,169,110,0.28)',
                background: 'rgba(200,169,110,0.04)',
                y: -3,
                transition: { duration: 0.2 },
              }}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 4,
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              {/* Watermark */}
              <span style={{
                position: 'absolute', bottom: -10, right: 8,
                fontSize: 60, fontWeight: 800, color: '#131210',
                fontFamily: 'var(--font-display)', lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {step.number}
              </span>

              <div>
                <p style={{ fontSize: 9, color: '#c8a96e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
                  {step.focus}
                </p>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#e8e2d8', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  {step.label}
                </h3>
              </div>

              <p style={{ fontSize: 11, color: '#686460', lineHeight: 1.65, flex: 1 }}>
                {step.description}
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10 }}>
                <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  OUTPUT
                </p>
                <p style={{ fontSize: 10, color: '#484541', lineHeight: 1.5 }}>
                  {step.output}
                </p>
              </div>
            </motion.div>

            {/* Arrow connector */}
            {i < STEPS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.09 }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '0 5px', color: '#1e1e1e',
                  fontSize: 14, flexShrink: 0,
                }}
              >
                →
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
