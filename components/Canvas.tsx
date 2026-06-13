'use client'

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { FRAMES, FILM_MARGIN, FRAME_H } from '@/lib/frames'
import { useCanvas, type Tool } from '@/hooks/useCanvas'
import AboutFrame from '@/components/frames/AboutFrame'
import WorkFrame from '@/components/frames/WorkFrame'
import ServicesFrame from '@/components/frames/ServicesFrame'
import ProcessFrame from '@/components/frames/ProcessFrame'
import ExperienceFrame from '@/components/frames/ExperienceFrame'
import ContactFrame from '@/components/frames/ContactFrame'
import ToolkitFrame from '@/components/frames/ToolkitFrame'

export interface CanvasHandle {
  flyTo: (id: string) => void
  fitAll: (animate?: boolean) => void
  getState: () => { tool: Tool; displayScale: number; selectedId: string | null }
  setTool: (t: Tool) => void
}

const FRAME_CONTENT: Record<string, React.ComponentType> = {
  about:      AboutFrame,
  work:       WorkFrame,
  services:   ServicesFrame,
  process:    ProcessFrame,
  experience: ExperienceFrame,
  toolkit:    ToolkitFrame,
  contact:    ContactFrame,
}

const STRIP_HALF_W = 3400
const HOLE_W = 14
const HOLE_H = 20
const HOLE_R = 3
const HOLE_SPACING = 52

interface Props {
  onStateChange: (state: { tool: Tool; displayScale: number; selectedId: string | null }) => void
  presentationMode: boolean
  onExitPresentation: () => void
}

const Canvas = forwardRef<CanvasHandle, Props>(function Canvas(
  { onStateChange, presentationMode, onExitPresentation },
  ref
) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const { canvasRef, tool, setTool, displayScale, selectedId, introComplete, flyTo, fitAll, setLocked } =
    useCanvas(viewportRef)

  // Cursor spotlight
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const glowX = useSpring(mouseX, { damping: 22, stiffness: 200, mass: 0.06 })
  const glowY = useSpring(mouseY, { damping: 22, stiffness: 200, mass: 0.06 })

  // Overlay fade timing
  const [overlayFading, setOverlayFading] = useState(false)
  const [overlayGone, setOverlayGone] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setOverlayFading(true),  300)
    const t2 = setTimeout(() => setOverlayGone(true),   1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Sync state upward
  useEffect(() => {
    onStateChange({ tool, displayScale, selectedId })
  }, [tool, displayScale, selectedId, onStateChange])

  useImperativeHandle(ref, () => ({
    flyTo, fitAll,
    getState: () => ({ tool, displayScale, selectedId }),
    setTool,
  }), [flyTo, fitAll, tool, displayScale, selectedId, setTool])

  // ── Presentation mode: lock canvas and navigate to first frame ──
  const flyToRef = useRef(flyTo)
  const fitAllExRef = useRef(fitAll)
  useEffect(() => { flyToRef.current = flyTo }, [flyTo])
  useEffect(() => { fitAllExRef.current = fitAll }, [fitAll])

  useEffect(() => {
    if (presentationMode) {
      setLocked(true)
      // Fly to current selected frame or first frame
      const id = selectedId ?? FRAMES[0].id
      flyToRef.current(id)
    } else {
      setLocked(false)
      fitAllExRef.current(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentationMode, setLocked])

  // ── Presentation: current frame index ──
  const currentIndex = selectedId ? FRAMES.findIndex(f => f.id === selectedId) : 0
  const safeIndex = currentIndex < 0 ? 0 : currentIndex

  const goToFrame = useCallback((idx: number) => {
    const clamped = (idx + FRAMES.length) % FRAMES.length
    flyTo(FRAMES[clamped].id)
  }, [flyTo])

  // ── Presentation: keyboard navigation ──
  useEffect(() => {
    if (!presentationMode) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goToFrame(safeIndex + 1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToFrame(safeIndex - 1)
      }
      if (e.key === 'Escape') {
        onExitPresentation()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [presentationMode, safeIndex, goToFrame, onExitPresentation])

  const cursorClass = presentationMode ? 'cursor-default' : (tool === 'pan' ? 'cursor-grab' : 'cursor-default')

  return (
    <div
      ref={viewportRef}
      className={`canvas-bg ${cursorClass}`}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', userSelect: 'none' }}
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }}
      onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000) }}
    >
      {/* ── Cursor spotlight ──────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: glowX,
          top: glowY,
          width: 720, height: 720,
          marginLeft: -360, marginTop: -360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.055) 0%, rgba(200,169,110,0.02) 35%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 6,
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Canvas world ──────────────────────────────────────── */}
      <div ref={canvasRef} className="canvas-world">
        <FilmStrip />

        {FRAMES.map(frame => {
          const Content = FRAME_CONTENT[frame.id]
          const isSelected = selectedId === frame.id
          return (
            <div
              key={frame.id}
              className={`artboard ${isSelected ? 'selected' : ''}`}
              style={{ left: frame.x, width: frame.w, height: frame.h }}
              onClick={() => {
                if (!presentationMode && tool !== 'pan') {
                  isSelected ? fitAll(true) : flyTo(frame.id)
                }
              }}
            >
              <Content />
            </div>
          )
        })}
      </div>

      {/* ── Escape hint (canvas mode, frame selected) — now at bottom ── */}
      <AnimatePresence>
        {!presentationMode && selectedId && (
          <motion.div
            key="escape-hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', bottom: 20, left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6, padding: '5px 12px',
              fontSize: 11, color: '#585858',
              pointerEvents: 'none', backdropFilter: 'blur(10px)',
              whiteSpace: 'nowrap', zIndex: 15,
            }}
          >
            Click again or press <kbd style={{ background: '#1a1a1a', padding: '1px 5px', borderRadius: 3, color: '#a09b93', fontSize: 10 }}>Esc</kbd> to see all reels
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Intro overlay ────────────────────────────────────── */}
      {!overlayGone && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: '#050505',
            opacity: overlayFading ? 0 : 1,
            transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: overlayFading ? 'none' : 'all',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#2a2a2a' }}>
            A  K I S H A N  S .  P A T E L  F I L M
          </p>
          <div style={{ width: 120, height: 1, background: '#111', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#2a2a2a', animation: 'loadBar 0.5s ease forwards', width: 0 }} />
          </div>
        </div>
      )}

      {/* ── Wayfinding hint ───────────────────────────────────── */}
      {introComplete && !presentationMode && <WayfindingHint />}
    </div>
  )
})

export default Canvas

// ── Film strip SVG ────────────────────────────────────────────
function FilmStrip() {
  const stripX = -STRIP_HALF_W
  const stripW = STRIP_HALF_W * 2
  const holeCount = Math.ceil(stripW / HOLE_SPACING) + 2
  const holeStartX = stripX + (HOLE_SPACING - ((STRIP_HALF_W % HOLE_SPACING))) % HOLE_SPACING

  const holeXs: number[] = []
  for (let i = 0; i < holeCount; i++) {
    holeXs.push(holeStartX + i * HOLE_SPACING)
  }

  const topHoleCY = -FILM_MARGIN / 2
  const botHoleCY = FRAME_H + FILM_MARGIN / 2

  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <rect x={stripX} y={-FILM_MARGIN} width={stripW} height={FILM_MARGIN} fill="#050505" />
      <rect x={stripX} y={FRAME_H} width={stripW} height={FILM_MARGIN} fill="#050505" />

      {holeXs.map(hx => (
        <rect key={`ht-${hx}`} x={hx - HOLE_W / 2} y={topHoleCY - HOLE_H / 2}
          width={HOLE_W} height={HOLE_H} rx={HOLE_R}
          fill="#000000" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      ))}
      {holeXs.map(hx => (
        <rect key={`hb-${hx}`} x={hx - HOLE_W / 2} y={botHoleCY - HOLE_H / 2}
          width={HOLE_W} height={HOLE_H} rx={HOLE_R}
          fill="#000000" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      ))}

      {FRAMES.map(frame => (
        <text key={`fn-${frame.id}`} x={frame.x + frame.w / 2} y={-FILM_MARGIN / 2 + 4}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={11} fontFamily="-apple-system, BlinkMacSystemFont, monospace"
          letterSpacing="0.12em" fill="rgba(255,255,255,0.12)">
          {frame.number}
        </text>
      ))}

      <text x={0} y={FRAME_H + FILM_MARGIN / 2 + 3}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={10} fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        letterSpacing="0.28em" fill="rgba(255,255,255,0.07)">
        KISHAN S. PATEL  ·  PRODUCT DESIGNER  ·  MOTADATA  ·  AHMEDABAD
      </text>

      {FRAMES.slice(0, -1).map(frame => (
        <line key={`div-${frame.id}`}
          x1={frame.x + frame.w + 30} y1={-FILM_MARGIN}
          x2={frame.x + frame.w + 30} y2={FRAME_H + FILM_MARGIN}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}

      {/* ── Figma-style prototype flow arcs ─────────────────── */}
      {FRAMES.slice(0, -1).map((frame, i) => {
        const next = FRAMES[i + 1]
        // Arc from bottom-center of frame i to bottom-center of frame i+1
        // Dips through the bottom sprocket area
        const sx = frame.x + frame.w / 2
        const ex = next.x + next.w / 2
        const arcY = FRAME_H + FILM_MARGIN * 0.68
        const d = `M ${sx} ${FRAME_H + 4} C ${sx} ${arcY}, ${ex} ${arcY}, ${ex} ${FRAME_H + 4}`
        const dotDur = `${5.5 + i * 0.7}s`
        const dotBegin = `${4.6 + i * 0.32}s`

        return (
          <g key={`flow-${frame.id}`}>
            {/* Track */}
            <motion.path
              id={`fp${i}`}
              d={d}
              stroke="rgba(200,169,110,0.07)"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 2.8 + i * 0.28, ease: [0.16, 1, 0.3, 1] }}
              vectorEffect="non-scaling-stroke"
            />
            {/* Arrowhead dot at destination */}
            <motion.circle
              cx={ex} cy={FRAME_H + 4} r="3"
              fill="none"
              stroke="rgba(200,169,110,0.3)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 4.5 + i * 0.28 }}
            />
            {/* Flowing packet dot */}
            <circle r="3.5" fill="rgba(200,169,110,0.55)" opacity="0" vectorEffect="non-scaling-stroke">
              <animate attributeName="opacity" values="0;0.55;0.55" keyTimes="0;0.001;1"
                dur="0.01s" begin={dotBegin} fill="freeze" />
              {React.createElement('animateMotion', {
                dur: dotDur,
                repeatCount: 'indefinite',
                begin: dotBegin,
                calcMode: 'spline',
                keySplines: '0.42 0 0.58 1',
                path: d,
              })}
            </circle>
          </g>
        )
      })}
    </svg>
  )
}

// ── Wayfinding hint (auto-fades) ──────────────────────────────
function WayfindingHint() {
  const [visible, setVisible] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),  200)
    const t2 = setTimeout(() => setVisible(false), 9200)
    const t3 = setTimeout(() => setGone(true),    10200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (gone) return null

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', bottom: 'clamp(68px, 9vh, 90px)', left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none', display: 'flex', gap: 10,
        background: 'rgba(8,8,8,0.72)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 100, padding: '8px 18px',
      }}
    >
      {[
        { key: '← drag →', desc: 'pan' },
        { key: '⌘ scroll', desc: 'zoom' },
        { key: 'click', desc: 'focus' },
      ].map(({ key, desc }, i) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {i > 0 && <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.07)', marginRight: 5, flexShrink: 0 }} />}
          <kbd style={{ fontSize: 10, color: '#686460', background: 'rgba(200,169,110,0.07)', border: '1px solid rgba(200,169,110,0.14)', borderRadius: 4, padding: '2px 8px', fontFamily: 'inherit', letterSpacing: '0.03em' }}>
            {key}
          </kbd>
          <span style={{ fontSize: 10, color: '#2e2e2e', letterSpacing: '0.05em' }}>{desc}</span>
        </div>
      ))}
    </motion.div>
  )
}
