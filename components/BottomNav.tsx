'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FRAMES } from '@/lib/frames'

let _navMountCount = 0

interface Props {
  selectedId: string | null
  presentationMode: boolean
  onSelect: (id: string) => void
  onFitAll: () => void
  onTogglePresentation: () => void
}

export default function BottomNav({ selectedId, presentationMode, onSelect, onFitAll, onTogglePresentation }: Props) {
  const isFirstMount = useRef(_navMountCount === 0)
  _navMountCount++

  // Shake the Present button after a short delay to draw attention
  const [shaking, setShaking] = useState(false)
  useEffect(() => {
    if (!isFirstMount.current) return
    const t = setTimeout(() => {
      setShaking(true)
      setTimeout(() => setShaking(false), 700)
    }, 5000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {!presentationMode && (
        <motion.nav
          className="bottom-nav"
          aria-label="Portfolio sections"
          initial={{ opacity: 0, y: -16, scale: 0.96, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: -16, scale: 0.96, x: '-50%' }}
          transition={{ duration: 0.4, delay: isFirstMount.current ? 1.4 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Fit-all */}
          <motion.button
            className="nav-fit-btn"
            onClick={onFitAll}
            title="Zoom to fit all (⌘0 / Escape)"
            aria-label="Zoom to fit all"
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.18 }}
          >
            <GridIcon />
          </motion.button>

          <div className="nav-divider" />

          {FRAMES.map((frame, i) => (
            <React.Fragment key={frame.id}>
              <motion.button
                className={`nav-item ${selectedId === frame.id ? 'active' : ''}`}
                onClick={() => onSelect(frame.id)}
                title={frame.label}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
              >
                <span className="nav-num">{frame.number}</span>
                <span>{frame.label}</span>
              </motion.button>
              {i < FRAMES.length - 1 && (
                <span aria-hidden="true" style={{ color: '#1e1e1e', fontSize: 10, userSelect: 'none', padding: '0 1px' }}>·</span>
              )}
            </React.Fragment>
          ))}

          <div className="nav-divider" />

          {/* Present button — distinct CTA pill */}
          <motion.button
            className="present-btn"
            onClick={onTogglePresentation}
            title="Enter fullscreen presentation — navigate with ← →"
            animate={shaking
              ? { x: [0, -5, 5, -5, 5, -3, 3, -1, 1, 0], rotate: [0, -2, 2, -2, 2, -1, 1, 0] }
              : { x: 0, rotate: 0 }
            }
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            whileTap={{ scale: 0.95 }}
          >
            <PlayIcon />
            <span>Present</span>
            <span style={{
              fontSize: 8, color: 'rgba(200,169,110,0.5)',
              border: '1px solid rgba(200,169,110,0.2)',
              borderRadius: 3, padding: '1px 5px', letterSpacing: '0.06em',
            }}>NEW</span>
          </motion.button>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <polygon points="2,1 10,5.5 2,10" fill="currentColor" opacity="0.85" />
    </svg>
  )
}
