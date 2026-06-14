'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SKILL_DOMAINS, TOOLS, METHODS, AI_TOOLS } from '@/lib/content'

export default function ToolkitFrame() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <div className="frame-inner" style={{ gap: 0 }}>
      <p className="frame-number">07</p>
      <h2 className="frame-title">Toolkit</h2>
      <div className="frame-divider" />

      {/* Domain rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {SKILL_DOMAINS.map((d, i) => (
          <motion.div
            key={d.area}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onHoverStart={() => setHoveredRow(i)}
            onHoverEnd={() => setHoveredRow(null)}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', gap: 0,
              position: 'relative',
              background: hoveredRow === i ? `${d.color}07` : 'transparent',
              borderBottom: i < SKILL_DOMAINS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.25s',
              cursor: 'default', overflow: 'hidden',
            }}
          >
            {/* Left accent bar */}
            <motion.div
              animate={{ scaleY: hoveredRow === i ? 1 : 0.15, opacity: hoveredRow === i ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: d.color, borderRadius: 1, transformOrigin: 'center' }}
            />

            {/* Icon + label */}
            <div style={{ width: 112, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 10 }}>
              <motion.span
                animate={{ color: hoveredRow === i ? d.color : `${d.color}33` }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: 12, lineHeight: 1 }}
              >{d.icon}</motion.span>
              <div>
                <motion.p
                  animate={{ color: hoveredRow === i ? '#ede8e0' : '#545048' }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2 }}
                >{d.area}</motion.p>
                <motion.p
                  animate={{ color: hoveredRow === i ? `${d.color}77` : '#181512' }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 7, letterSpacing: '0.05em', marginTop: 1 }}
                >{d.note}</motion.p>
              </div>
            </div>

            {/* Separator */}
            <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.05)', flexShrink: 0, margin: '0 10px' }} />

            {/* Skill tags */}
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', minWidth: 0 }}>
              {d.skills.map((sk, si) => (
                <motion.span
                  key={sk}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.2 + i * 0.08 + si * 0.03 }}
                  style={{
                    fontSize: 8,
                    color: hoveredRow === i ? '#706a64' : '#2e2b28',
                    background: hoveredRow === i ? `${d.color}0d` : 'transparent',
                    border: `1px solid ${hoveredRow === i ? `${d.color}28` : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 3, padding: '2px 6px',
                    letterSpacing: '0.02em', whiteSpace: 'nowrap',
                    transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                  }}
                >{sk}</motion.span>
              ))}
            </div>

            {/* Ghost number */}
            <motion.span
              animate={{ opacity: hoveredRow === i ? 1 : 0, x: hoveredRow === i ? 0 : 10 }}
              transition={{ duration: 0.22 }}
              style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: `${d.color}18`, letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0, paddingLeft: 6, userSelect: 'none' }}
            >0{i + 1}</motion.span>
          </motion.div>
        ))}
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          marginTop: 8, paddingTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, rowGap: 4,
        }}
      >
        <span style={{ fontSize: 7, color: '#2a2520', letterSpacing: '0.14em', textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>Tools</span>
        {TOOLS.map(t => <span key={t} style={{ fontSize: 8, color: '#383432', marginRight: 10 }}>{t}</span>)}

        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.07)', display: 'inline-block', margin: '0 10px' }} />

        <span style={{ fontSize: 7, color: '#2a2520', letterSpacing: '0.14em', textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>Methods</span>
        {METHODS.map(m => <span key={m} style={{ fontSize: 8, color: '#2e2b28', marginRight: 10 }}>{m}</span>)}

        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.07)', display: 'inline-block', margin: '0 10px' }} />

        <span style={{ fontSize: 7, color: '#2a2520', letterSpacing: '0.14em', textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>AI</span>
        {AI_TOOLS.map(a => (
          <span key={a.name} style={{ fontSize: 8, color: '#484541', border: `1px solid ${a.color}20`, borderLeft: `1.5px solid ${a.color}50`, borderRadius: 2, padding: '1px 5px', marginRight: 4, background: `${a.color}08` }}>{a.name}</span>
        ))}
      </motion.div>
    </div>
  )
}
