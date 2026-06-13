'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'framer-motion'
import { FRAMES } from '@/lib/frames'

// ── Mouse spring for parallax ──────────────────────────────────

function useMouseSpring(strength = 0.012) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { damping: 28, stiffness: 180, mass: 0.06 })
  const y = useSpring(my, { damping: 28, stiffness: 180, mass: 0.06 })
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set((e.clientX - window.innerWidth / 2) * strength)
      my.set((e.clientY - window.innerHeight / 2) * strength)
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [mx, my, strength])
  return { x, y }
}

// ── Shared micro-components ────────────────────────────────────

function SplitText({ text, delay = 0, charDelay = 0.03 }: { text: string; delay?: number; charDelay?: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', lineHeight: 1.15 }}>
          <motion.span
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.55, delay: delay + i * charDelay, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-block' }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </>
  )
}

function AnimCount({ to, suffix = '', delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const ctrl = animate(0, to, {
      duration: 1.6, ease: [0.16, 1, 0.3, 1], delay,
      onUpdate: v => { if (node) node.textContent = Math.round(v) + suffix },
    })
    return ctrl.stop
  }, [to, suffix, delay])
  return <span ref={ref}>{to}{suffix}</span>
}

function TiltPhoto({ children, w, h }: { children: React.ReactNode; w: number; h: number }) {
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { damping: 22, stiffness: 220, mass: 0.06 })
  const sry = useSpring(ry, { damping: 22, stiffness: 220, mass: 0.06 })
  return (
    <div
      style={{ perspective: 900, width: w, height: h, flexShrink: 0 }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        rx.set(-((e.clientY - r.top - r.height / 2) / r.height) * 12)
        ry.set(((e.clientX - r.left - r.width / 2) / r.width) * 12)
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }}
    >
      <motion.div style={{ rotateX: srx, rotateY: sry, width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  )
}

function Particles({ n = 14 }: { n?: number }) {
  const pts = useMemo(() =>
    Array.from({ length: n }, (_, i) => ({
      x: ((i * 67 + 11) % 97),
      y: ((i * 41 + 23) % 91),
      sz: 1 + (i % 2) * 0.5,
      dur: 4 + (i % 4) * 1.2,
      dly: (i * 0.5) % 4,
      dx: ((i * 31) % 28) - 14,
      dy: -(6 + (i * 17) % 12),
    }))
  , [n])
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {pts.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, p.dy, 0], x: [0, p.dx, 0], opacity: [0.04, 0.13, 0.04] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.dly, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.sz, height: p.sz, borderRadius: '50%', background: '#c8a96e' }}
        />
      ))}
    </div>
  )
}

// ── Autonomous & interactive graphic primitives ─────────────────

function SpinArc({ size, speed, color, opacity = 0.3, thick = 1, reverse = false }: {
  size: number; speed: number; color: string; opacity?: number; thick?: number; reverse?: boolean
}) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', borderRadius: '50%',
        width: size, height: size,
        border: `${thick}px solid transparent`,
        borderTopColor: color, borderRightColor: color,
        opacity, pointerEvents: 'none',
      }}
    />
  )
}

function OrbDot({ radius, speed, color, dotSize = 4, delay = 0, reverse = false }: {
  radius: number; speed: number; color: string; dotSize?: number; delay?: number; reverse?: boolean
}) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear', delay }}
      style={{
        position: 'absolute', width: radius * 2, height: radius * 2,
        top: '50%', left: '50%', marginTop: -radius, marginLeft: -radius,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: -dotSize / 2, left: '50%', marginLeft: -dotSize / 2,
        width: dotSize, height: dotSize, borderRadius: '50%',
        background: color, opacity: 0.8,
        boxShadow: `0 0 ${dotSize * 3}px ${color}`,
      }} />
    </motion.div>
  )
}

function ConcentricRings({ radii = [80, 130, 180, 230, 280], color = 'rgba(200,169,110,0.14)' }: {
  radii?: number[]; color?: string
}) {
  return (
    <>
      {radii.map((r, i) => (
        <motion.div
          key={r}
          animate={{ scale: [1, 1.03, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 4 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          style={{
            position: 'absolute', borderRadius: '50%',
            width: r * 2, height: r * 2,
            border: `1px solid ${color}`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

function Bracket({ pos, size = 16, color = 'rgba(200,169,110,0.2)' }: {
  pos: 'tl' | 'tr' | 'bl' | 'br'; size?: number; color?: string
}) {
  const base: React.CSSProperties = { position: 'absolute', width: size, height: size, borderColor: color, pointerEvents: 'none' }
  const sides: Record<string, React.CSSProperties> = {
    tl: { top: 0, left: 0, borderTop: '1px solid', borderLeft: '1px solid' },
    tr: { top: 0, right: 0, borderTop: '1px solid', borderRight: '1px solid' },
    bl: { bottom: 0, left: 0, borderBottom: '1px solid', borderLeft: '1px solid' },
    br: { bottom: 0, right: 0, borderBottom: '1px solid', borderRight: '1px solid' },
  }
  return <div style={{ ...base, ...sides[pos] }} />
}

function ScanLine({ color = 'rgba(200,169,110,0.04)', duration = 9 }: { color?: string; duration?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ top: ['-8%', '108%'] }}
      transition={{ duration, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
      style={{
        position: 'absolute', left: 0, right: 0, height: 100,
        background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

function StatChip({ label, value, color = '#c8a96e', delay = 0 }: {
  label: string; value: string; color?: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '10px 16px', borderRadius: 6,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 9, color: '#282420', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color, letterSpacing: '0.02em', lineHeight: 1 }}>{value}</span>
    </motion.div>
  )
}

function BgNum({ n }: { n: string }) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', right: '-2%', bottom: '-6%',
      fontSize: 'clamp(120px, 18vw, 300px)',
      fontFamily: 'var(--font-display)', fontWeight: 700,
      color: 'rgba(255,255,255,0.012)', lineHeight: 1, letterSpacing: '-0.05em',
      userSelect: 'none', pointerEvents: 'none', zIndex: 0,
    }}>{n}</div>
  )
}

function SlideHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 24, position: 'relative', zIndex: 2, flexShrink: 0 }}>
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ fontSize: 11, color: '#c8a96e', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}
      >{num}</motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
        style={{ fontSize: 'clamp(34px, 4.5vw, 60px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f2ede6', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}
      >{title}</motion.h2>
    </div>
  )
}

const SP = 'clamp(28px, 4.5vh, 64px) clamp(28px, 5vw, 80px) clamp(20px, 3.5vh, 48px)'

// ─────────────────────────────────────────────────────────────
// Slide: About
// ─────────────────────────────────────────────────────────────

const SPECS = ['Product Design', 'UX Research', 'Dashboard UI', 'Design Systems', 'Enterprise UX', 'Interaction Design']
const TOOLS_LIST = ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'After Effects']

function SlideAbout() {
  const { x: glowX, y: glowY } = useMouseSpring(0.022)
  const { x: colX, y: colY } = useMouseSpring(0.036)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <Particles n={18} />
      <BgNum n="01" />

      <motion.div aria-hidden="true" style={{
        x: glowX, y: glowY,
        position: 'absolute', left: '22%', top: '28%',
        width: 680, height: 680, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Left: text */}
      <div style={{ flex: 1, padding: '0 0 0 clamp(28px, 6vw, 96px)', display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 2, maxWidth: '56%' }}>
        <div>
          <div style={{ fontSize: 'clamp(52px, 7.5vw, 108px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f2ede6', lineHeight: 0.94, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            <SplitText text="KISHAN" delay={0.1} charDelay={0.042} />
          </div>
          <div style={{ fontSize: 'clamp(52px, 7.5vw, 108px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f2ede6', lineHeight: 0.94, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            <SplitText text="S. PATEL" delay={0.32} charDelay={0.038} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.76 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <span className="live-dot" />
          <span style={{ fontSize: 12, color: '#c8a96e', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
            Product Designer · Motadata
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ fontSize: 'clamp(14px, 1.2vw, 17px)', color: '#7a766f', lineHeight: 1.8, maxWidth: 500 }}
        >
          Crafting intuitive digital experiences that balance aesthetics with human-centered thinking.
          Four years shaping interfaces at the intersection of design and business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.05 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}
        >
          {SPECS.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.84, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 1.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ borderColor: 'rgba(200,169,110,0.4)', color: '#c8a96e' }}
              style={{ fontSize: 12, color: '#585450', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '5px 13px', cursor: 'default', transition: 'border-color 0.2s, color 0.2s' }}
            >{s}</motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.32 }}
          style={{ display: 'flex', gap: 12 }}
        >
          <motion.a
            href="https://www.behance.net/kishanspatel" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04, backgroundColor: '#d4b878' }} whileTap={{ scale: 0.96 }}
            style={{ fontSize: 13, fontWeight: 600, color: '#080808', background: '#c8a96e', padding: '12px 30px', borderRadius: 6, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >Behance ↗</motion.a>
          <motion.a
            href="/kishan-resume.pdf" target="_blank" rel="noopener noreferrer"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)', color: '#a09b93' }} whileTap={{ scale: 0.97 }}
            style={{ fontSize: 13, color: '#585450', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.03)', padding: '12px 30px', borderRadius: 6, textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
          >Resume ↗</motion.a>
        </motion.div>
      </div>

      {/* Right: photo + stats */}
      <motion.div style={{
        x: colX, y: colY,
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        gap: 18, alignItems: 'center',
        padding: '0 clamp(20px, 4vw, 64px) 0 0',
        position: 'relative', zIndex: 2,
      }}>
        <TiltPhoto w={240} h={292}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%', height: '100%',
              borderRadius: 12, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)', background: '#1a1a1a',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,169,110,0.07)',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, color: 'rgba(200,169,110,0.12)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>KP</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kisu2.png" alt="Kishan S. Patel"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 1 }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          </motion.div>
        </TiltPhoto>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          style={{ display: 'flex', width: 240 }}
        >
          {[
            { to: 4, suffix: '+', label: 'Years' },
            { to: 20, suffix: '+', label: 'Modules' },
            { to: 4, suffix: '', label: 'Certs' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              flex: 1, padding: '12px 0',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              paddingLeft: i > 0 ? 12 : 0,
              textAlign: i === 0 ? 'left' : 'center',
            }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#c8a96e', fontFamily: 'var(--font-display)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                <AnimCount to={stat.to} suffix={stat.suffix} delay={0.85 + i * 0.14} />
              </p>
              <p style={{ fontSize: 10, color: '#2e2e2e', marginTop: 3, letterSpacing: '0.05em' }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          style={{ width: 240, display: 'flex', flexWrap: 'wrap', gap: 5 }}
        >
          {TOOLS_LIST.map((tool, i) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 1.2 + i * 0.07 }}
              style={{ fontSize: 11, color: '#353230', letterSpacing: '0.04em' }}
            >
              {i > 0 && <span style={{ color: '#1e1e1e', marginRight: 5 }}>·</span>}
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide: Work
// ─────────────────────────────────────────────────────────────

// ── CSS project mockups ────────────────────────────────────────
function ProjectMockup({ id }: { id: string }) {
  const base: React.CSSProperties = {
    width: '100%', height: '100%',
    background: '#111', borderRadius: 6, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
    position: 'relative', flexShrink: 0,
  }
  const bar = (color: string, w: string, delay = 0): React.CSSProperties => ({
    height: 4, borderRadius: 2, background: color, width: w,
    marginBottom: 3, opacity: 0.7,
  })

  if (id === 'rum') return (
    <div style={base}>
      {/* Top bar */}
      <div style={{ padding: '8px 8px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 4, alignItems: 'center' }}>
        {['#3a3a3a','#3a3a3a','#c8a96e'].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c}}/>)}
        <div style={{ flex:1, height:4, borderRadius:2, background:'#1e1e1e', marginLeft:4 }}/>
      </div>
      {/* Metric cards row */}
      <div style={{ display:'flex', gap:4, padding:'6px 6px 0' }}>
        {[['#7eb8e8','72%'],['#7ee8a8','88%'],['#e8c87e','64%']].map(([c,w],i)=>(
          <div key={i} style={{ flex:1, background:'#181818', borderRadius:3, padding:4, border:'1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ height:3, borderRadius:1, background:c as string, width:w, opacity:0.55, marginBottom:3 }}/>
            <div style={{ height:2, borderRadius:1, background:'#2a2a2a', width:'60%' }}/>
          </div>
        ))}
      </div>
      {/* Chart area */}
      <div style={{ margin:'5px 6px 4px', height:36, background:'#141414', borderRadius:3, border:'1px solid rgba(255,255,255,0.03)', position:'relative', overflow:'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 160 36" preserveAspectRatio="none">
          <polyline points="0,28 20,22 40,18 60,24 80,14 100,18 120,10 140,14 160,8"
            fill="none" stroke="rgba(126,184,232,0.5)" strokeWidth="1.5"/>
          <polygon points="0,28 20,22 40,18 60,24 80,14 100,18 120,10 140,14 160,8 160,36 0,36"
            fill="url(#rumgrd)"/>
          <defs><linearGradient id="rumgrd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(126,184,232,0.15)"/>
            <stop offset="100%" stopColor="rgba(126,184,232,0)"/>
          </linearGradient></defs>
        </svg>
      </div>
      {/* Session rows */}
      {[0,1,2].map(i=>(
        <div key={i} style={{ display:'flex', gap:5, alignItems:'center', padding:'2px 6px' }}>
          <div style={{ width:3, height:3, borderRadius:'50%', background: i===0?'#7eb8e8':'#2a2a2a', flexShrink:0 }}/>
          <div style={{ height:3, borderRadius:1, background:'#1e1e1e', width:`${55+i*15}%` }}/>
          <div style={{ marginLeft:'auto', height:3, borderRadius:1, background:'#1e1e1e', width:18, flexShrink:0 }}/>
        </div>
      ))}
    </div>
  )

  if (id === 'metric') return (
    <div style={base}>
      <div style={{ padding:'8px 8px 4px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:4, alignItems:'center' }}>
        {['#3a3a3a','#3a3a3a','#c8a96e'].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c}}/>)}
        <div style={{flex:1,height:4,borderRadius:2,background:'#1e1e1e',marginLeft:4}}/>
      </div>
      {/* Query bar */}
      <div style={{ display:'flex', gap:4, padding:'6px 6px 4px' }}>
        <div style={{ flex:2, height:16, borderRadius:3, background:'#181818', border:'1px solid rgba(126,200,158,0.2)', display:'flex', alignItems:'center', padding:'0 5px', gap:3 }}>
          <div style={{ width:24, height:3, borderRadius:1, background:'rgba(126,200,158,0.35)' }}/>
          <div style={{ width:14, height:3, borderRadius:1, background:'#282828' }}/>
        </div>
        <div style={{ flex:1, height:16, borderRadius:3, background:'#181818', border:'1px solid rgba(255,255,255,0.04)' }}/>
        <div style={{ width:24, height:16, borderRadius:3, background:'rgba(126,200,158,0.12)', border:'1px solid rgba(126,200,158,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:8, height:3, borderRadius:1, background:'rgba(126,200,158,0.5)' }}/>
        </div>
      </div>
      {/* Dual chart area */}
      <div style={{ margin:'0 6px 4px', height:44, background:'#141414', borderRadius:3, border:'1px solid rgba(255,255,255,0.03)', position:'relative', overflow:'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 160 44" preserveAspectRatio="none">
          <polyline points="0,34 28,24 56,30 84,16 112,22 140,12 160,18" fill="none" stroke="rgba(126,200,158,0.55)" strokeWidth="1.5"/>
          <polyline points="0,38 28,32 56,36 84,28 112,34 140,24 160,30" fill="none" stroke="rgba(200,169,110,0.4)" strokeWidth="1" strokeDasharray="3,2"/>
          {/* Y axis ticks */}
          {[8,22,36].map(y=><line key={y} x1="0" y1={y} x2="160" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>)}
        </svg>
      </div>
      {/* Legend */}
      <div style={{ display:'flex', gap:8, padding:'0 6px' }}>
        {[['rgba(126,200,158,0.55)','Metric A'],['rgba(200,169,110,0.5)','Metric B']].map(([c,l])=>(
          <div key={l as string} style={{ display:'flex', alignItems:'center', gap:3 }}>
            <div style={{ width:10, height:2, background:c as string, borderRadius:1 }}/>
            <span style={{ fontSize:8, color:'#333' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (id === 'dashboard') return (
    <div style={base}>
      <div style={{ padding:'8px 8px 4px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:4, alignItems:'center' }}>
        {['#3a3a3a','#3a3a3a','#c8a96e'].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c}}/>)}
        <div style={{flex:1,height:4,borderRadius:2,background:'#1e1e1e',marginLeft:4}}/>
        <div style={{ width:20, height:8, borderRadius:2, background:'rgba(232,126,184,0.18)', border:'1px solid rgba(232,126,184,0.22)', marginLeft:4 }}/>
      </div>
      {/* 2x2 widget grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, padding:'5px 6px' }}>
        {/* Widget 1: line chart */}
        <div style={{ background:'#181818', borderRadius:3, border:'1px solid rgba(255,255,255,0.04)', padding:4, height:38 }}>
          <div style={{ height:3, borderRadius:1, background:'#2a2a2a', width:'50%', marginBottom:3 }}/>
          <svg width="100%" height="24" viewBox="0 0 70 24" preserveAspectRatio="none">
            <polyline points="0,18 14,12 28,16 42,8 56,12 70,6" fill="none" stroke="rgba(232,126,184,0.5)" strokeWidth="1.5"/>
          </svg>
        </div>
        {/* Widget 2: bar chart */}
        <div style={{ background:'#181818', borderRadius:3, border:'1px solid rgba(255,255,255,0.04)', padding:4, height:38 }}>
          <div style={{ height:3, borderRadius:1, background:'#2a2a2a', width:'55%', marginBottom:4 }}/>
          <div style={{ display:'flex', gap:3, alignItems:'flex-end', height:22 }}>
            {[65,85,50,90,70].map((h,i)=><div key={i} style={{flex:1,background:`rgba(232,126,184,${0.2+i*0.06})`,borderRadius:'1px 1px 0 0',height:`${h}%`}}/>)}
          </div>
        </div>
        {/* Widget 3: metric tiles */}
        <div style={{ background:'#181818', borderRadius:3, border:'1px solid rgba(255,255,255,0.04)', padding:4, height:38 }}>
          <div style={{ height:3, borderRadius:1, background:'#2a2a2a', width:'40%', marginBottom:4 }}/>
          <div style={{ display:'flex', gap:3 }}>
            {['rgba(232,126,184,0.4)','rgba(200,169,110,0.35)'].map((c,i)=>(
              <div key={i} style={{ flex:1, background:c, borderRadius:2, height:18 }}/>
            ))}
          </div>
        </div>
        {/* Widget 4: topology nodes */}
        <div style={{ background:'#181818', borderRadius:3, border:'1px solid rgba(255,255,255,0.04)', padding:4, height:38, position:'relative', overflow:'hidden' }}>
          <div style={{ height:3, borderRadius:1, background:'#2a2a2a', width:'45%', marginBottom:4 }}/>
          <svg width="100%" height="24" viewBox="0 0 70 24">
            <line x1="35" y1="4" x2="18" y2="20" stroke="rgba(232,126,184,0.2)" strokeWidth="0.8"/>
            <line x1="35" y1="4" x2="52" y2="20" stroke="rgba(232,126,184,0.2)" strokeWidth="0.8"/>
            <circle cx="35" cy="4" r="3.5" fill="rgba(232,126,184,0.5)"/>
            <circle cx="18" cy="20" r="2.5" fill="rgba(232,126,184,0.25)"/>
            <circle cx="52" cy="20" r="2.5" fill="rgba(232,126,184,0.25)"/>
          </svg>
        </div>
      </div>
    </div>
  )

  // 'system' — design system preview
  return (
    <div style={base}>
      <div style={{ padding:'8px 8px 4px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:4, alignItems:'center' }}>
        {['#3a3a3a','#3a3a3a','#c8a96e'].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c}}/>)}
        <div style={{flex:1,height:4,borderRadius:2,background:'#1e1e1e',marginLeft:4}}/>
      </div>
      <div style={{ padding:'5px 6px', display:'flex', flexDirection:'column', gap:6 }}>
        {/* Color tokens */}
        <div>
          <div style={{ fontSize:7, color:'#333', letterSpacing:'0.1em', marginBottom:3 }}>COLOR TOKENS</div>
          <div style={{ display:'flex', gap:3 }}>
            {['#c8a96e','#7eb8e8','#7ee8a8','#e87eb8','#b87ee8','#e8c87e'].map(c=>(
              <div key={c} style={{ width:14, height:14, borderRadius:2, background:c, opacity:0.75 }}/>
            ))}
          </div>
        </div>
        {/* Typography scale */}
        <div>
          <div style={{ fontSize:7, color:'#333', letterSpacing:'0.1em', marginBottom:3 }}>TYPE SCALE</div>
          {[['H1','#e8e2d8','70%'],['Body','#686460','55%'],['Label','#3a3a3a','45%']].map(([l,c,w])=>(
            <div key={l as string} style={{ display:'flex', gap:5, alignItems:'center', marginBottom:2 }}>
              <span style={{ fontSize:7, color:'#2a2a2a', width:18, flexShrink:0 }}>{l}</span>
              <div style={{ height: l==='H1'?4:l==='Body'?3:2, borderRadius:1, background:c as string, width:w, opacity:0.6 }}/>
            </div>
          ))}
        </div>
        {/* Component samples */}
        <div style={{ display:'flex', gap:4 }}>
          <div style={{ height:12, borderRadius:2, background:'rgba(184,126,232,0.25)', border:'1px solid rgba(184,126,232,0.3)', padding:'0 6px', display:'flex', alignItems:'center' }}>
            <div style={{ width:18, height:2, borderRadius:1, background:'rgba(184,126,232,0.6)' }}/>
          </div>
          <div style={{ height:12, borderRadius:2, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', padding:'0 4px', display:'flex', alignItems:'center', gap:3 }}>
            <div style={{ width:4, height:4, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)' }}/>
            <div style={{ width:14, height:2, borderRadius:1, background:'#2a2a2a' }}/>
          </div>
        </div>
      </div>
    </div>
  )
}

const WORK_PROJECTS = [
  {
    id: 'rum', title: 'RUM Module', year: '2023', type: 'New module',
    subtitle: 'Real User Monitoring — ObserveOps',
    scope: 'End-to-end · Full module',
    process: [true, true, true, true],
    outcome: 'Shipped as a core ObserveOps module — zero major UX issues in first QA cycle.',
    contributions: [
      'Led user research with engineering & product stakeholders to scope data requirements and define monitoring workflows',
      'Designed complete IA: session replay, performance metrics, error tracking, and alert configuration flows',
      'Built UI from scratch — drill-down dashboards, trend visualisations, and threshold alert design',
      'Maintained component consistency with the ObserveOps design system throughout delivery',
    ],
    tags: ['Research-led', 'Dashboard', 'Data Viz', 'Enterprise'],
  },
  {
    id: 'metric', title: 'Metric Explorer', year: '2023', type: 'Redesign',
    subtitle: 'Query & Visualisation Redesign — ObserveOps',
    scope: 'Redesign · Existing module',
    process: [false, true, true, true],
    outcome: 'Reduced query-building friction — cleaner visual hierarchy and progressive disclosure validated by engineering walkthroughs.',
    contributions: [
      'Audited pain points via stakeholder walkthroughs and a heuristic evaluation of the existing query builder',
      'Simplified complex multi-metric query interface using progressive disclosure and contextual filters',
      'Redesigned chart types, time range selectors, comparison views, and metric grouping interactions',
      'Documented updated interaction patterns as reusable components in the ObserveOps design system',
    ],
    tags: ['Redesign', 'Query UI', 'Data Viz', 'Figma'],
  },
  {
    id: 'dashboard', title: 'Dashboard System', year: '2022–24', type: 'Feature suite',
    subtitle: 'Create · Add Widget · Global Filter · Topology',
    scope: 'Feature suite · Ongoing',
    process: [true, true, true, true],
    outcome: 'Unified dashboard creation, widget management, and cross-module filtering into one cohesive system.',
    contributions: [
      'Designed "Create Dashboard" and "Add New Widget" with template-based creation and custom widget flows',
      'Built Global Filter panel and Search system for cross-module navigation at enterprise scale',
      'Covered Topology map views, Trap log management, NetRoute card views, and Log/Flow Explorers',
      'Established pattern library for dashboard components reused across 10+ product modules',
    ],
    tags: ['System Design', 'Widget Library', 'Navigation', 'Topology'],
  },
  {
    id: 'system', title: 'Design System', year: '2022–24', type: 'Infrastructure',
    subtitle: 'Component Library, Tokens & Guidelines — ObserveOps',
    scope: 'System · Ongoing ownership',
    process: [true, true, true, true],
    outcome: 'Single source of truth powering 20+ product modules — adopted by engineering and PM teams.',
    contributions: [
      'Built and maintained a Figma component library covering all 20+ ObserveOps product modules',
      'Defined design tokens for color, spacing, typography, elevation, and animation timing values',
      'Created motion & animation guidelines covering micro-interactions and state transition patterns',
      'Owned documentation: style guide, usage notes, and component changelog for engineering alignment',
    ],
    tags: ['Design System', 'Tokens', 'Component Library', 'Documentation'],
  },
]

const PROC_LABELS = ['Research', 'Wireframe', 'Design', 'Ship']

function SlideWork() {
  const [active, setActive] = useState(0)
  const proj = WORK_PROJECTS[active]

  return (
    <div style={{ width: '100%', height: '100%', padding: SP, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <BgNum n="02" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
        <SlideHeader num="02 / 07" title="Selected Work" />
        <motion.a
          href="https://www.behance.net/kishanspatel" target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ color: '#c8a96e' }}
          style={{ fontSize: 11, color: '#333', letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase', marginBottom: 28, transition: 'color 0.2s', flexShrink: 0 }}
        >Full portfolio ↗</motion.a>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 'clamp(24px, 3vw, 48px)', minHeight: 0, position: 'relative', zIndex: 2 }}>
        {/* Left: project selector */}
        <div style={{ width: 'clamp(180px, 20vw, 240px)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {WORK_PROJECTS.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              onClick={() => setActive(i)}
              whileHover={{ x: 3 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: 3,
                padding: '12px 14px', borderRadius: 6, border: 'none',
                background: active === i ? 'rgba(200,169,110,0.07)' : 'transparent',
                borderLeft: `2px solid ${active === i ? '#c8a96e' : 'transparent'}`,
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              <span style={{ fontSize: 9, color: '#c8a96e', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{p.year} · {p.type}</span>
              <motion.span
                animate={{ color: active === i ? '#f2ede6' : '#686460' }}
                style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.02em', transition: 'color 0.2s' }}
              >{p.title}</motion.span>
              <span style={{ fontSize: 11, color: active === i ? '#7a766f' : '#333', transition: 'color 0.2s', lineHeight: 1.4 }}>{p.subtitle}</span>
            </motion.button>
          ))}
        </div>

        {/* Right: project detail */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: '#c8a96e', border: '1px solid rgba(200,169,110,0.28)', borderRadius: 3, padding: '3px 10px', letterSpacing: '0.06em' }}>{proj.year}</span>
                    <span style={{ fontSize: 11, color: '#484541', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, padding: '3px 10px', letterSpacing: '0.04em' }}>{proj.scope}</span>
                  </div>
                  <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 34px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f2ede6', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1, marginBottom: 6 }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#686460', lineHeight: 1.5 }}>{proj.subtitle}</p>
                </div>
                {/* CSS mockup preview */}
                <motion.div
                  key={proj.id + '-mockup'}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: 'clamp(110px, 14vw, 170px)', height: 'clamp(80px, 10vw, 120px)', flexShrink: 0 }}
                >
                  <ProjectMockup id={proj.id} />
                </motion.div>
              </div>

              {/* Process bars */}
              <div>
                <p style={{ fontSize: 10, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Process Coverage</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PROC_LABELS.map((label, i) => (
                    <div key={label} style={{ flex: 1 }}>
                      <div style={{ height: 4, borderRadius: 2, background: '#171717', overflow: 'hidden', marginBottom: 5 }}>
                        {proj.process[i] && (
                          <motion.div
                            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                            style={{ height: '100%', background: '#c8a96e', borderRadius: 2, transformOrigin: 'left' }}
                          />
                        )}
                      </div>
                      <p style={{ fontSize: 9, color: proj.process[i] ? '#585450' : '#1e1e1e', letterSpacing: '0.04em' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributions */}
              <div style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'none' }}>
                <p style={{ fontSize: 10, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contributions</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {proj.contributions.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.08 }}
                      style={{ display: 'flex', gap: 12 }}
                    >
                      <span style={{ flexShrink: 0, width: 22, height: 22, border: '1px solid rgba(200,169,110,0.22)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#c8a96e', marginTop: 2 }}>{i + 1}</span>
                      <p style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', color: '#686460', lineHeight: 1.72 }}>{c}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Outcome + tags */}
              <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                <p style={{ fontSize: 12, color: '#585450', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 10 }}>
                  <span style={{ color: '#c8a96e', fontStyle: 'normal', fontWeight: 700, marginRight: 7 }}>↳</span>
                  {proj.outcome}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {proj.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, color: '#383330', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, padding: '3px 9px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide: Services
// ─────────────────────────────────────────────────────────────

const SVCS = [
  {
    num: '01', title: 'UX Research & Strategy', stat: '20+', statLabel: 'modules',
    accentColor: '#7eb8e8',
    hook: 'Every module I\'ve shipped at Motadata started with research — not wireframes. Stakeholder interviews, heuristic audits, and competitive analyses that turn vague feature requests into precise design briefs your engineering team can actually build against.',
    proof: 'Applied on: RUM, Metric Explorer, NCCM, Dashboard',
    deliverables: ['Stakeholder interviews', 'Heuristic audits', 'Competitive analysis', 'User flow mapping'],
    icon: (active: boolean) => (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="14" cy="14" r="8" stroke={active ? '#7eb8e8' : 'rgba(126,184,232,0.25)'} strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="4" stroke={active ? '#7eb8e8' : 'rgba(126,184,232,0.15)'} strokeWidth="1"/>
        <line x1="20" y1="20" x2="28" y2="28" stroke={active ? '#7eb8e8' : 'rgba(126,184,232,0.25)'} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="1.5" fill={active ? '#7eb8e8' : 'rgba(126,184,232,0.3)'}/>
      </svg>
    ),
  },
  {
    num: '02', title: 'UI Design', stat: '4 yrs', statLabel: 'enterprise',
    accentColor: '#c8a96e',
    hook: 'Twenty-plus enterprise modules. Every screen designed to survive an ops engineer mid-incident — high cognitive load, time pressure, bad data. That constraint makes the interface have to earn every pixel it uses.',
    proof: 'Applied on: ObserveOps full product suite',
    deliverables: ['High-fi Figma screens', 'Design systems', 'Dev-ready handoff', 'Responsive layouts'],
    icon: (active: boolean) => (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="2" stroke={active ? '#c8a96e' : 'rgba(200,169,110,0.25)'} strokeWidth="1.5"/>
        <line x1="4" y1="12" x2="28" y2="12" stroke={active ? '#c8a96e' : 'rgba(200,169,110,0.2)'} strokeWidth="1"/>
        <rect x="8" y="16" width="6" height="6" rx="1" fill={active ? 'rgba(200,169,110,0.25)' : 'rgba(200,169,110,0.08)'}/>
        <line x1="18" y1="17" x2="24" y2="17" stroke={active ? '#c8a96e' : 'rgba(200,169,110,0.2)'} strokeWidth="1" strokeLinecap="round"/>
        <line x1="18" y1="20" x2="22" y2="20" stroke={active ? '#c8a96e' : 'rgba(200,169,110,0.12)'} strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03', title: 'Prototyping & Interaction', stat: '0 sprints', statLabel: 'wasted',
    accentColor: '#7ee8a8',
    hook: 'An interactive Figma prototype that answers a stakeholder question costs 10 minutes. The same question answered after engineering builds it costs two sprints. I prototype fast so ambiguity gets resolved before it becomes expensive.',
    proof: 'Applied on: RUM module, Alert flows, Dashboard creation',
    deliverables: ['Interactive Figma flows', 'Micro-interaction design', 'After Effects motion', 'Clickable prototypes'],
    icon: (active: boolean) => (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <polygon points="11,8 25,16 11,24" fill={active ? 'rgba(126,232,168,0.25)' : 'rgba(126,232,168,0.08)'} stroke={active ? '#7ee8a8' : 'rgba(126,232,168,0.25)'} strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="7" cy="8" r="2" fill={active ? '#7ee8a8' : 'rgba(126,232,168,0.2)'}/>
        <circle cx="7" cy="16" r="2" fill={active ? 'rgba(126,232,168,0.5)' : 'rgba(126,232,168,0.1)'}/>
        <circle cx="7" cy="24" r="2" fill={active ? 'rgba(126,232,168,0.3)' : 'rgba(126,232,168,0.08)'}/>
      </svg>
    ),
  },
  {
    num: '04', title: 'Branding & Visual Identity', stat: 'Vec', statLabel: 'first',
    accentColor: '#e87eb8',
    hook: 'Started as a graphic designer — Photoshop and Illustrator before Figma existed in my workflow. Can move from brief to final vector artwork in a single session. Brand identity, icon systems, campaign assets — tool-agnostic and built for the real world.',
    proof: 'Applied on: ObserveOps icons, SMB brand identities, print collateral',
    deliverables: ['Logo & mark design', 'Brand guidelines', 'Vector illustration (Ai)', 'Social & print assets'],
    icon: (active: boolean) => (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 6 L26 26 L6 26 Z" stroke={active ? '#e87eb8' : 'rgba(232,126,184,0.25)'} strokeWidth="1.5" strokeLinejoin="round" fill={active ? 'rgba(232,126,184,0.1)' : 'none'}/>
        <circle cx="16" cy="15" r="4" stroke={active ? '#e87eb8' : 'rgba(232,126,184,0.2)'} strokeWidth="1"/>
        <circle cx="16" cy="15" r="1.5" fill={active ? '#e87eb8' : 'rgba(232,126,184,0.3)'}/>
      </svg>
    ),
  },
]

function SlideServices() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ width: '100%', height: '100%', padding: SP, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ScanLine color="rgba(200,169,110,0.035)" duration={11} />
      <BgNum n="03" />
      <SlideHeader num="03 / 07" title="Services" />

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 10,
        position: 'relative', zIndex: 2, minHeight: 0,
      }}>
        {SVCS.map((svc, i) => {
          const isHov = hovered === svc.num
          return (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.52, delay: 0.16 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onHoverStart={() => setHovered(svc.num)}
              onHoverEnd={() => setHovered(null)}
              style={{
                border: `1px solid ${isHov ? `${svc.accentColor}38` : 'rgba(255,255,255,0.06)'}`,
                background: isHov ? `${svc.accentColor}07` : 'rgba(255,255,255,0.02)',
                borderRadius: 10,
                padding: 'clamp(14px, 2vh, 22px) clamp(16px, 2vw, 24px)',
                display: 'flex', flexDirection: 'column', gap: 10,
                transition: 'border-color 0.25s, background 0.25s',
                cursor: 'default', overflow: 'hidden', position: 'relative',
              }}
            >
              {/* Top row: icon + title + stat */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <motion.div animate={{ opacity: isHov ? 1 : 0.55 }} transition={{ duration: 0.2 }}>
                    {svc.icon(isHov)}
                  </motion.div>
                  <h3 style={{
                    fontSize: 'clamp(13px, 1.2vw, 16px)', fontWeight: 700,
                    color: isHov ? '#f2ede6' : '#d8d2c8',
                    letterSpacing: '0.01em', lineHeight: 1.3, transition: 'color 0.22s',
                  }}>{svc.title}</h3>
                </div>
                {/* Stat */}
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(18px, 2vw, 26px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: isHov ? svc.accentColor : 'rgba(200,169,110,0.18)', lineHeight: 1, transition: 'color 0.25s' }}>{svc.stat}</div>
                  <div style={{ fontSize: 9, color: '#282420', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{svc.statLabel}</div>
                </div>
              </div>

              {/* Hook paragraph */}
              <p style={{ fontSize: 'clamp(11px, 0.95vw, 13px)', color: '#686460', lineHeight: 1.78, flex: 1 }}>{svc.hook}</p>

              {/* Proof + deliverables */}
              <div style={{ paddingTop: 8, borderTop: `1px solid ${isHov ? `${svc.accentColor}18` : 'rgba(255,255,255,0.04)'}`, display: 'flex', flexDirection: 'column', gap: 7, transition: 'border-color 0.22s' }}>
                <p style={{ fontSize: 10, color: isHov ? `${svc.accentColor}bb` : '#2a2420', letterSpacing: '0.04em', transition: 'color 0.22s' }}>{svc.proof}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {svc.deliverables.map(d => (
                    <span key={d} style={{
                      fontSize: 10, color: '#484541',
                      border: `1px solid ${isHov ? `${svc.accentColor}28` : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 3, padding: '2px 8px', letterSpacing: '0.03em',
                      transition: 'border-color 0.22s',
                    }}>{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide: Process  — horizontal expanding accordion cards
// ─────────────────────────────────────────────────────────────

const PROC_STEPS = [
  {
    num: '01', label: 'Research',
    icon: '◎',
    desc: 'Before a pixel gets touched, the problem needs to be understood cold — not assumed. Stakeholder interviews, competitive analysis, and heuristic audits surface the real friction. At Motadata, every module started here: research findings that kept every downstream design decision defensible.',
    proof: 'RUM: interviewed 4 engineering leads before wireframe 1',
    deliverable: 'Research synthesis doc',
    activities: ['Stakeholder interviews', 'Competitive analysis', 'Heuristic audits', 'Analytics review'],
  },
  {
    num: '02', label: 'Define',
    icon: '◈',
    desc: 'Research is noise until it\'s crystallised into a shared brief. User needs, constraints, success metrics, guiding principles — a document that gives the entire team one source of truth. The discipline here prevents scope creep and aimless iteration later.',
    proof: 'Dashboard: 3-page brief cut scope by 40% before kickoff',
    deliverable: 'Problem statement + brief',
    activities: ['User need statements', 'Success metrics', 'Design principles', 'Scope definition'],
  },
  {
    num: '03', label: 'Wireframe',
    icon: '▣',
    desc: 'Low-fidelity decisions made fast and changed cheaply. IA structures and user flow maps that align stakeholders before committing to Figma. The best wireframe session ends with engineering saying "I get what we\'re building now."',
    proof: 'Metric Explorer: IA restructure saved 2 sprints of rework',
    deliverable: 'Flows + IA diagrams',
    activities: ['Information architecture', 'User flow mapping', 'Low-fi sketches', 'Stakeholder review'],
  },
  {
    num: '04', label: 'Design',
    icon: '◆',
    desc: 'High-fidelity Figma, component library, interactive prototypes — built to survive engineering scrutiny. Design decisions that look good but can\'t be built are just art. Every screen goes through Figma annotation and design system sync before handoff.',
    proof: 'Design System: components powering 20+ modules with 0 rework',
    deliverable: 'Figma prototype + specs',
    activities: ['Component-driven UI', 'Interactive prototypes', 'Figma annotations', 'Design system sync'],
  },
  {
    num: '05', label: 'Ship',
    icon: '▶',
    desc: 'Annotated specs, design tokens, QA iteration. Design doesn\'t end at Figma handoff — it ends when users use it without confusion. Post-launch observations and retrospectives feed directly into the next research cycle.',
    proof: 'RUM module: 0 UX-related bugs in first engineering QA pass',
    deliverable: 'Shipped feature + retrospective',
    activities: ['Developer QA support', 'Token delivery', 'Post-launch review', 'Retro documentation'],
  },
]

function SlideProcess() {
  const [active, setActive] = useState(2)
  const step = PROC_STEPS[active]

  return (
    <div style={{ width: '100%', height: '100%', padding: SP, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ScanLine color="rgba(200,169,110,0.04)" duration={10} />
      <BgNum n="04" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
        <SlideHeader num="04 / 07" title="Design Process" />
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ marginBottom: 28, display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}
        >
          {PROC_STEPS.map((s, i) => (
            <motion.div key={s.num} animate={{ background: active === i ? '#c8a96e' : 'rgba(255,255,255,0.08)' }} transition={{ duration: 0.3 }}
              style={{ width: active === i ? 24 : 8, height: 4, borderRadius: 2, cursor: 'pointer', transition: 'width 0.3s' }}
              onClick={() => setActive(i)}
            />
          ))}
        </motion.div>
      </div>

      {/* Expanding accordion cards */}
      <div style={{ flex: 1, display: 'flex', gap: 8, minHeight: 0, position: 'relative', zIndex: 2 }}>
        {PROC_STEPS.map((s, i) => (
          <motion.div
            key={s.num}
            layout
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1, y: 0,
              flex: active === i ? 2.6 : 0.55,
              borderColor: active === i ? 'rgba(200,169,110,0.35)' : 'rgba(255,255,255,0.06)',
              background: active === i ? 'rgba(200,169,110,0.05)' : 'rgba(255,255,255,0.02)',
            }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1], delay: active === i ? 0 : 0 }}
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, overflow: 'hidden',
              cursor: active === i ? 'default' : 'pointer',
              position: 'relative', minWidth: 0,
            }}
          >
            {/* Inactive: compact label */}
            <AnimatePresence>
              {active !== i && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '16px 6px',
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(28px, 3vw, 44px)', fontFamily: 'var(--font-display)',
                    color: 'rgba(200,169,110,0.2)', fontWeight: 700, lineHeight: 1,
                  }}>{s.num}</span>
                  <span style={{
                    fontSize: 10, color: '#383430', letterSpacing: '0.08em',
                    textTransform: 'uppercase', fontWeight: 600,
                    writingMode: 'vertical-rl', textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                  }}>{s.label}</span>
                  <span style={{ fontSize: 14, color: 'rgba(200,169,110,0.15)' }}>{s.icon}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active: full content */}
            <AnimatePresence>
              {active === i && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  style={{ padding: 'clamp(20px, 3vh, 32px) clamp(20px, 2.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: 18, height: '100%', boxSizing: 'border-box' }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 10, color: '#c8a96e', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Step {s.num}</p>
                      <h3 style={{
                        fontSize: 'clamp(28px, 4vw, 56px)',
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        color: '#f2ede6', textTransform: 'uppercase',
                        letterSpacing: '0.04em', lineHeight: 0.95,
                      }}>{s.label}</h3>
                    </div>
                    <span style={{ fontSize: 22, color: 'rgba(200,169,110,0.25)', marginTop: 4, flexShrink: 0 }}>{s.icon}</span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 'clamp(13px, 1.1vw, 15px)', color: '#7a766f', lineHeight: 1.82 }}>{s.desc}</p>

                  {/* Activities */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Key Activities</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {s.activities.map((a, ai) => (
                        <motion.span
                          key={a}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, delay: 0.2 + ai * 0.06 }}
                          style={{ fontSize: 12, color: '#686460', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '6px 13px', letterSpacing: '0.03em' }}
                        >{a}</motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Proof + deliverable row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(126,184,232,0.05)', border: '1px solid rgba(126,184,232,0.12)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: 'rgba(126,184,232,0.6)', flexShrink: 0, letterSpacing: '0.06em' }}>↳ Real example:</span>
                      <span style={{ fontSize: 11, color: '#585450', fontStyle: 'italic' }}>{s.proof}</span>
                    </div>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(200,169,110,0.07)', border: '1px solid rgba(200,169,110,0.18)',
                      borderRadius: 5, display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ fontSize: 9, color: '#c8a96e', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>Deliverable</span>
                      <span style={{ width: 1, height: 10, background: 'rgba(200,169,110,0.3)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#a09b93' }}>{s.deliverable}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide: Toolkit
// ─────────────────────────────────────────────────────────────

const SKILL_DOMAINS = [
  {
    area: 'Research & Strategy',
    color: '#7ee8a8',
    icon: '◎',
    note: 'How I define the problem',
    skills: ['Stakeholder Interviews', 'Heuristic Audits', 'Competitive Analysis', 'Journey Mapping', 'Usability Testing', 'Scope Definition'],
  },
  {
    area: 'UI & Visual Design',
    color: '#c8a96e',
    icon: '◆',
    note: 'How I build the interface',
    skills: ['High-fidelity Screens', 'Data Visualisation', 'Dashboard Layouts', 'Typography', 'Icon Design', 'Responsive UI'],
  },
  {
    area: 'Systems & Craft',
    color: '#7eb8e8',
    icon: '▣',
    note: 'How I scale design',
    skills: ['Component Libraries', 'Design Tokens', 'Style Guides', 'Dev Handoff', 'Motion Guidelines', 'Documentation'],
  },
  {
    area: 'Prototyping & Motion',
    color: '#b87ee8',
    icon: '▶',
    note: 'How I communicate intent',
    skills: ['Interactive Figma Flows', 'Micro-interactions', 'After Effects', 'Clickable Prototypes', 'Annotated Specs'],
  },
]

const TOOL_ITEMS = [
  { name: 'Figma', color: '#9d5cf2', initial: 'Fi' },
  { name: 'Adobe XD', color: '#ff61f6', initial: 'Xd' },
  { name: 'Illustrator', color: '#ff9a00', initial: 'Ai' },
  { name: 'Photoshop', color: '#31a8ff', initial: 'Ps' },
  { name: 'After Effects', color: '#d199ff', initial: 'Ae' },
]

const METHOD_ITEMS = ['Design Thinking', 'Agile / Scrum', 'Atomic Design', 'Jobs-to-be-Done', 'Lean UX', 'Heuristic Eval']
const AI_TOOLS = [
  { name: 'Claude', color: '#d97757' },
  { name: 'Gemini', color: '#4285F4' },
  { name: 'ChatGPT', color: '#10a37f' },
  { name: 'v0', color: '#ffffff' },
  { name: 'Bolt', color: '#7c3aed' },
  { name: 'Loveable', color: '#f43f5e' },
]

function SlideToolkit() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <div style={{ width: '100%', height: '100%', padding: SP, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <BgNum n="06" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
        <SlideHeader num="06 / 07" title="Toolkit" />
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
        >
          <span className="live-dot" style={{ width: 5, height: 5 }} />
          <span style={{ fontSize: 10, color: '#2a2520', letterSpacing: '0.14em', textTransform: 'uppercase' }}>4 years of craft</span>
        </motion.div>
      </div>

      {/* Domain rows — full-width horizontal strips */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2, minHeight: 0 }}>
        {SKILL_DOMAINS.map((d, i) => (
          <motion.div
            key={d.area}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.18 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onHoverStart={() => setHoveredRow(i)}
            onHoverEnd={() => setHoveredRow(null)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              position: 'relative',
              cursor: 'default',
              background: hoveredRow === i ? `${d.color}07` : 'transparent',
              borderBottom: i < SKILL_DOMAINS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.28s',
              overflow: 'hidden',
            }}
          >
            {/* Animated left accent bar */}
            <motion.div
              animate={{ scaleY: hoveredRow === i ? 1 : 0.18, opacity: hoveredRow === i ? 1 : 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                background: d.color, borderRadius: 1, transformOrigin: 'center',
              }}
            />

            {/* Icon + label — fixed left column */}
            <div style={{ width: 'clamp(160px, 16vw, 200px)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 16 }}>
              <motion.span
                animate={{ color: hoveredRow === i ? d.color : `${d.color}33`, scale: hoveredRow === i ? 1.25 : 1 }}
                transition={{ duration: 0.22 }}
                style={{ fontSize: 18, lineHeight: 1, display: 'block' }}
              >{d.icon}</motion.span>
              <div>
                <motion.p
                  animate={{ color: hoveredRow === i ? '#ede8e0' : '#5a5550' }}
                  transition={{ duration: 0.22 }}
                  style={{ fontSize: 'clamp(11px, 1.05vw, 13px)', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2 }}
                >{d.area}</motion.p>
                <motion.p
                  animate={{ color: hoveredRow === i ? `${d.color}88` : '#1a1714' }}
                  transition={{ duration: 0.22 }}
                  style={{ fontSize: 9, letterSpacing: '0.07em', marginTop: 2 }}
                >{d.note}</motion.p>
              </div>
            </div>

            {/* Tick separator */}
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.05)', flexShrink: 0, margin: '0 20px' }} />

            {/* Skill tags — flow freely */}
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', minWidth: 0 }}>
              {d.skills.map((sk, si) => (
                <motion.span
                  key={sk}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.32 + i * 0.1 + si * 0.04 }}
                  style={{
                    fontSize: 11,
                    color: hoveredRow === i ? '#807a74' : '#363230',
                    background: hoveredRow === i ? `${d.color}0d` : 'transparent',
                    border: `1px solid ${hoveredRow === i ? `${d.color}2a` : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 4, padding: '4px 11px',
                    letterSpacing: '0.025em',
                    transition: 'color 0.22s, background 0.22s, border-color 0.22s',
                    whiteSpace: 'nowrap',
                  }}
                >{sk}</motion.span>
              ))}
            </div>

            {/* Ghost row number — far right, reveals on hover */}
            <motion.span
              animate={{ opacity: hoveredRow === i ? 1 : 0, x: hoveredRow === i ? 0 : 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 6vw, 72px)', fontWeight: 700,
                color: `${d.color}18`, letterSpacing: '-0.04em', lineHeight: 1,
                flexShrink: 0, paddingLeft: 12, userSelect: 'none',
              }}
            >0{i + 1}</motion.span>
          </motion.div>
        ))}
      </div>

      {/* Bottom strip: tools · methods · AI — single dense row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        style={{
          paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, rowGap: 5,
          position: 'relative', zIndex: 2,
        }}
      >
        {/* Tools */}
        <span style={{ fontSize: 8, color: '#2e2e2e', letterSpacing: '0.16em', textTransform: 'uppercase', marginRight: 12, flexShrink: 0 }}>Tools</span>
        {TOOL_ITEMS.map(t => (
          <span key={t.name} style={{ fontSize: 10, color: '#404040', marginRight: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: t.color, fontSize: 8 }}>▪</span>{t.name}
          </span>
        ))}

        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', display: 'inline-block', margin: '0 14px' }} />

        {/* Methods */}
        <span style={{ fontSize: 8, color: '#2e2e2e', letterSpacing: '0.16em', textTransform: 'uppercase', marginRight: 12, flexShrink: 0 }}>Methods</span>
        {METHOD_ITEMS.map((m, i) => (
          <span key={m} style={{ fontSize: 10, color: '#383432', marginRight: 12 }}>
            {i > 0 && <span style={{ color: '#252220', marginRight: 12 }}>·</span>}{m}
          </span>
        ))}

        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', display: 'inline-block', margin: '0 14px' }} />

        {/* AI in Workflow */}
        <span style={{ fontSize: 8, color: '#2e2e2e', letterSpacing: '0.16em', textTransform: 'uppercase', marginRight: 10, flexShrink: 0 }}>AI</span>
        {AI_TOOLS.map(a => (
          <span key={a.name} style={{
            fontSize: 10, color: '#585450',
            border: `1px solid ${a.color}20`, borderLeft: `2px solid ${a.color}50`,
            borderRadius: 3, padding: '2px 8px', marginRight: 5,
            background: `${a.color}08`, letterSpacing: '0.02em',
          }}>{a.name}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide: Experience
// ─────────────────────────────────────────────────────────────

const TIMELINE_ENTRIES = [
  {
    role: 'Product Designer', company: 'Motadata', period: 'Jul 2022 — Present', current: true,
    desc: 'Sole UX designer for ObserveOps — an enterprise IT monitoring platform serving infrastructure and operations teams across 20+ product modules.',
    bullets: [
      'Owned end-to-end design for 20+ modules: RUM, Metric Explorer, Dashboard System, Log/Flow Explorer, NCCM/Compliance, and more',
      'Drove research: stakeholder interviews, heuristic evaluations, competitive audits, and user walkthrough sessions',
      'Built and maintained the ObserveOps Figma design system — components, tokens, typography, and motion guidelines',
      'Collaborated with PMs and engineers through wireframe reviews, Figma handoffs, and QA iteration',
    ],
    skills: ['Figma', 'UX Research', 'Design Systems', 'Dashboard UI', 'Prototyping', 'Adobe XD'],
  },
  {
    role: 'Freelance Designer', company: 'Independent', period: 'Dec 2021 — Feb 2022', current: false,
    desc: 'Designed brand identity, web layouts, and print collateral for small businesses — sharpening visual craft before entering enterprise UX.',
    bullets: [
      'Delivered logo design, social media asset kits, and brochure layouts for SMB clients',
      'Worked independently across Illustrator and Photoshop to produce print-ready artwork',
      'Developed fast iteration and client communication skills under independent deadlines',
    ],
    skills: ['Illustrator', 'Photoshop', 'Branding', 'Print Design'],
  },
  {
    role: 'MSC in CA & IT', company: 'K S School of Business Management', period: '2020 — 2022', current: false,
    desc: 'Master of Science in Computer Applications & IT, Gujarat University. Built foundations in systems thinking, software design, and information management that directly inform current UX practice.',
    bullets: [
      'Studied software design, information systems, and IT management across two years',
      'Built systems thinking foundations that translate directly into enterprise UX decision-making',
      'Self-taught Figma and Adobe XD in parallel — pivoted fully into product design by graduation',
    ],
    skills: ['Systems Design', 'IT Management', 'Research', 'HTML/CSS basics'],
  },
]

const MODULES_GRID = [
  { name: 'RUM', color: '#7eb8e8' }, { name: 'Metric Explorer', color: '#7ee8a8' },
  { name: 'Dashboard', color: '#e87eb8' }, { name: 'Log Explorer', color: '#c8a96e' },
  { name: 'Flow Explorer', color: '#7ee8a8' }, { name: 'NCCM', color: '#b87ee8' },
  { name: 'Topology', color: '#7eb8e8' }, { name: 'APM Compare', color: '#e8c87e' },
  { name: 'Alert Correl.', color: '#e87eb8' }, { name: 'Trap Explorer', color: '#c8a96e' },
  { name: 'NetRoute', color: '#7eb8e8' }, { name: 'Design System', color: '#b87ee8' },
  { name: 'Settings', color: '#686460' }, { name: 'Licence Mgmt', color: '#686460' },
]

function SlideExperience() {
  const [selected, setSelected] = useState(0)
  const entry = TIMELINE_ENTRIES[selected]

  return (
    <div style={{ width: '100%', height: '100%', padding: SP, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <BgNum n="05" />
      <SlideHeader num="05 / 07" title="Experience" />

      {/* Metrics banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ display: 'flex', gap: 8, marginBottom: 20, position: 'relative', zIndex: 2, flexShrink: 0 }}
      >
        {[
          { label: 'At Motadata', value: '4+ Yrs' },
          { label: 'Modules shipped', value: '20+' },
          { label: 'Design system', value: '1 owned' },
          { label: 'Started design', value: 'Jul 2022' },
        ].map((m, i) => (
          <StatChip key={m.label} label={m.label} value={m.value} delay={0.35 + i * 0.08} />
        ))}
      </motion.div>

      <div style={{ flex: 1, display: 'flex', gap: 'clamp(24px, 3.5vw, 56px)', position: 'relative', zIndex: 2, minHeight: 0 }}>
        {/* Left: timeline */}
        <div style={{ width: 'clamp(190px, 20vw, 250px)', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 9, top: 12, bottom: 0, width: 1, background: 'rgba(255,255,255,0.04)' }}>
            <motion.div
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #c8a96e, rgba(200,169,110,0.08))', transformOrigin: 'top' }}
            />
          </div>

          {TIMELINE_ENTRIES.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelected(i)}
              whileHover={{ x: 3 }}
              style={{ paddingLeft: 30, paddingBottom: 22, position: 'relative', cursor: 'pointer' }}
            >
              <motion.div
                animate={{
                  background: selected === i ? '#c8a96e' : (e.current ? '#c8a96e' : '#1a1a1a'),
                  borderColor: selected === i ? '#c8a96e' : (e.current ? '#c8a96e' : 'rgba(255,255,255,0.1)'),
                  scale: selected === i ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', left: 3, top: 5, width: 13, height: 13, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {e.current && (
                  <motion.div
                    animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'rgba(200,169,110,0.28)' }}
                  />
                )}
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <motion.p
                  animate={{ color: selected === i ? '#f2ede6' : (e.current ? '#e8e2d8' : '#686460') }}
                  style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, transition: 'color 0.2s' }}
                >{e.role}</motion.p>
                {e.current && <span className="live-dot" style={{ width: 5, height: 5 }} />}
              </div>
              <p style={{ fontSize: 11, color: '#c8a96e', letterSpacing: '0.05em', marginBottom: 2 }}>{e.company}</p>
              <p style={{ fontSize: 11, color: '#3a3a3a', letterSpacing: '0.04em' }}>{e.period}</p>
            </motion.div>
          ))}
        </div>

        {/* Right: detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden', flex: 1 }}
            >
              <div style={{
                padding: '18px 22px',
                background: entry.current ? 'rgba(200,169,110,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${entry.current ? 'rgba(200,169,110,0.14)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 8, position: 'relative', flexShrink: 0,
              }}>
                {entry.current && <><Bracket pos="tl" /><Bracket pos="tr" /><Bracket pos="bl" /><Bracket pos="br" /></>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#c8a96e', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{entry.company}</p>
                    <h3 style={{ fontSize: 'clamp(18px, 2vw, 26px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f2ede6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{entry.role}</h3>
                  </div>
                  <span style={{ fontSize: 11, color: '#3a3a3a', letterSpacing: '0.04em', marginTop: 4, flexShrink: 0, marginLeft: 12 }}>{entry.period}</span>
                </div>
                <p style={{ fontSize: 13, color: '#7a766f', lineHeight: 1.72, marginBottom: 12 }}>{entry.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', scrollbarWidth: 'none' }}>
                  {entry.bullets.map((b, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.05 + i * 0.07 }}
                      style={{ display: 'flex', gap: 10 }}
                    >
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#c8a96e', flexShrink: 0, marginTop: 8 }} />
                      <p style={{ fontSize: 13, color: '#686460', lineHeight: 1.7 }}>{b}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Skills used */}
              {entry.skills.length > 0 && (
                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Skills Used</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {entry.skills.map(skill => (
                      <motion.span key={skill} whileHover={{ borderColor: 'rgba(200,169,110,0.3)', color: '#c8a96e' }}
                        style={{ fontSize: 11, color: '#585450', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '4px 11px', cursor: 'default', transition: 'border-color 0.2s, color 0.2s' }}
                      >{skill}</motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Module grid (only for Motadata entry) */}
              {entry.current && (
                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Modules Contributed To</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {MODULES_GRID.map((m, i) => (
                      <motion.div key={m.name}
                        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.04 }}
                        whileHover={{ scale: 1.06, borderColor: `${m.color}55` }}
                        style={{
                          fontSize: 10, color: '#484541',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 3, padding: '3px 9px',
                          borderLeft: `2px solid ${m.color}44`,
                          cursor: 'default', transition: 'border-color 0.2s',
                        }}
                      >{m.name}</motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide: Contact
// ─────────────────────────────────────────────────────────────

const CONTACT_CARDS = [
  { label: 'Email', value: 'kishanspatel@gmail.com', href: 'mailto:kishanspatel@gmail.com', color: '#c8a96e', icon: '✉' },
  { label: 'Behance', value: 'behance.net/kishanspatel', href: 'https://www.behance.net/kishanspatel', color: '#0057ff', icon: 'Be' },
  { label: 'LinkedIn', value: 'kishanspatel49', href: 'https://www.linkedin.com/in/kishanspatel49/', color: '#0a66c2', icon: 'in' },
  { label: 'Dribbble', value: 'dribbble.com/kishanspatel', href: 'https://dribbble.com/kishanspatel', color: '#ea4c89', icon: '◎' },
]

function SlideContact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('kishanspatel@gmail.com').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } catch { /* show success anyway */ }
    setSent(true)
  }

  return (
    <div style={{ width: '100%', height: '100%', padding: SP, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Animated orbital background — centered on right panel */}
      <div aria-hidden="true" style={{ position: 'absolute', right: '18%', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'relative', width: 0, height: 0 }}>
          <ConcentricRings radii={[90, 140, 195, 250, 310]} color="rgba(200,169,110,0.10)" />
          <OrbDot radius={90} speed={10} color="#c8a96e" dotSize={5} />
          <OrbDot radius={140} speed={16} color="#7eb8e8" dotSize={3.5} delay={3} reverse />
          <OrbDot radius={195} speed={24} color="#c8a96e" dotSize={3} delay={6} />
          <OrbDot radius={250} speed={34} color="#e87eb8" dotSize={2.5} delay={10} reverse />
          <SpinArc size={180} speed={22} color="rgba(200,169,110,0.18)" thick={1} />
          <SpinArc size={280} speed={36} color="rgba(126,184,232,0.1)" thick={1} reverse />
          {/* Center mark */}
          <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: 'rgba(200,169,110,0.35)', top: -3, left: -3 }} />
        </div>
      </div>

      <SlideHeader num="07 / 07" title="Get in Touch" />

      <div style={{ flex: 1, display: 'flex', gap: 'clamp(28px, 5vw, 72px)', position: 'relative', zIndex: 2, minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left panel ── */}
        <div style={{ width: 'clamp(260px, 30vw, 380px)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Big copy-to-click email */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p style={{ fontSize: 9, color: '#2a2520', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Primary Contact</p>
            <motion.button
              onClick={copyEmail}
              whileHover={{ borderColor: 'rgba(200,169,110,0.4)', background: 'rgba(200,169,110,0.06)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', textAlign: 'left', padding: '16px 18px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <Bracket pos="tl" size={12} /><Bracket pos="br" size={12} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 'clamp(12px, 1.1vw, 15px)', color: '#c8a96e', letterSpacing: '0.02em', lineHeight: 1.3, fontWeight: 600 }}>kishanspatel</p>
                  <p style={{ fontSize: 'clamp(12px, 1.1vw, 15px)', color: '#c8a96e', letterSpacing: '0.02em', lineHeight: 1.3, fontWeight: 600 }}>@gmail.com</p>
                </div>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="copied" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 10, color: '#4ade80', letterSpacing: '0.08em', marginTop: 2, flexShrink: 0 }}>✓ Copied!</motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 9, color: '#2e2e2e', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2, flexShrink: 0 }}>Click to copy</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </motion.div>

          {/* Social link cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <p style={{ fontSize: 9, color: '#2a2520', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 4 }}>Find Me Online</p>
            {CONTACT_CARDS.slice(1).map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.38 + i * 0.09 }}
                whileHover={{ x: 4, borderColor: `${link.color}44` }}
                style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 7,
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderLeft: `2px solid ${link.color}40`,
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
              >
                <span style={{ width: 28, height: 28, borderRadius: 5, background: `${link.color}15`, border: `1px solid ${link.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: link.color, flexShrink: 0, fontFamily: 'system-ui' }}>{link.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: '#686460', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 1 }}>{link.label}</p>
                  <p style={{ fontSize: 11, color: '#3a3530', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.value}</p>
                </div>
                <span style={{ fontSize: 11, color: '#2a2520', marginLeft: 'auto', flexShrink: 0 }}>↗</span>
              </motion.a>
            ))}
          </div>

          {/* Availability + location row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.75 }}
            style={{ display: 'flex', gap: 8 }}
          >
            <div style={{ flex: 1, padding: '11px 13px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.14)', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="live-dot" />
              <div>
                <p style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Open to work</p>
                <p style={{ fontSize: 9, color: '#2a2520', marginTop: 1 }}>Freelance & full-time</p>
              </div>
            </div>
            <div style={{ padding: '11px 13px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
              <p style={{ fontSize: 9, color: '#2e2e2e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Location</p>
              <p style={{ fontSize: 10, color: '#585450', whiteSpace: 'nowrap' }}>Ahmedabad · IST</p>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            style={{ borderLeft: '2px solid rgba(200,169,110,0.2)', paddingLeft: 12 }}
          >
            <p style={{ fontSize: 'clamp(11px, 0.9vw, 13px)', color: '#3a3530', lineHeight: 1.75, fontStyle: 'italic' }}>
              &ldquo;I design for the people who will use it — not the spec sheet.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* ── Right panel: form ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', position: 'relative' }}
            >
              <div style={{ position: 'relative', width: 0, height: 0 }}>
                <ConcentricRings radii={[30, 55, 80]} color="rgba(200,169,110,0.15)" />
                <OrbDot radius={30} speed={4} color="#c8a96e" dotSize={4} />
              </div>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{ fontSize: 44, color: '#c8a96e', marginTop: 20, lineHeight: 1 }}
              >✓</motion.div>
              <p style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: '#c8a96e', letterSpacing: '0.1em' }}>SENT.</p>
              <p style={{ fontSize: 14, color: '#686460', lineHeight: 1.7, maxWidth: 320 }}>Thanks for reaching out. I respond within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1, position: 'relative' }}>
              <Bracket pos="tl" size={20} /><Bracket pos="tr" size={20} />
              <Bracket pos="bl" size={20} /><Bracket pos="br" size={20} />

              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{ padding: '10px 14px', background: 'rgba(200,169,110,0.04)', border: '1px solid rgba(200,169,110,0.1)', borderRadius: 5, marginBottom: 4 }}
              >
                <p style={{ fontSize: 10, color: '#585450', lineHeight: 1.7 }}>
                  Open to <span style={{ color: '#c8a96e' }}>freelance projects</span>, <span style={{ color: '#c8a96e' }}>product design roles</span>, and interesting design conversations. Usually responds within 24 hours.
                </p>
              </motion.div>

              {(['name', 'email'] as const).map((key, i) => (
                <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.38 + i * 0.1 }}>
                  <label style={{ fontSize: 9, color: '#2e2e2e', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    {key === 'name' ? 'Name' : 'Email'}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    placeholder={key === 'name' ? 'Your name' : 'your@email.com'}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '12px 15px', fontSize: 13, color: '#e8e2d8', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.42)'; e.currentTarget.style.background = 'rgba(200,169,110,0.03)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  />
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.58 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <label style={{ fontSize: 9, color: '#2e2e2e', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea
                  placeholder="Tell me about your project, opportunity, or just say hi."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '12px 15px', fontSize: 13, color: '#e8e2d8', outline: 'none', resize: 'none', fontFamily: 'inherit', minHeight: 90, boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.42)'; e.currentTarget.style.background = 'rgba(200,169,110,0.03)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.68 }}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.025, backgroundColor: '#d4b878' }} whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', fontSize: 12, fontWeight: 700, color: '#080808', background: '#c8a96e', border: 'none', borderRadius: 7, padding: '14px', cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <span>Send Message</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
                </motion.button>
              </motion.div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Slide registry & variants
// ─────────────────────────────────────────────────────────────

const SLIDE_MAP: Record<string, React.ComponentType> = {
  about: SlideAbout,
  work: SlideWork,
  services: SlideServices,
  process: SlideProcess,
  experience: SlideExperience,
  toolkit: SlideToolkit,
  contact: SlideContact,
}

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 40, filter: 'blur(8px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] } },
  exit: (d: number) => ({ opacity: 0, x: d * -40, filter: 'blur(8px)', transition: { duration: 0.38, ease: [0.4, 0, 1, 1] } }),
}

// ─────────────────────────────────────────────────────────────
// PresentationSlides — main export
// ─────────────────────────────────────────────────────────────

interface Props {
  currentIndex: number
  onGoTo: (i: number) => void
  onExit: () => void
}

export default function PresentationSlides({ currentIndex: externalIndex, onGoTo, onExit }: Props) {
  const [idx, setIdx] = useState(externalIndex)
  const [direction, setDirection] = useState(1)
  const prevIdxRef = useRef(externalIndex)

  useEffect(() => {
    if (externalIndex === prevIdxRef.current) return
    const n = FRAMES.length
    let d = externalIndex > prevIdxRef.current ? 1 : -1
    if (prevIdxRef.current === n - 1 && externalIndex === 0) d = 1
    if (prevIdxRef.current === 0 && externalIndex === n - 1) d = -1
    setDirection(d)
    setIdx(externalIndex)
    prevIdxRef.current = externalIndex
  }, [externalIndex])

  const navigate = useCallback((to: number) => {
    const n = FRAMES.length
    const clamped = ((to % n) + n) % n
    const prev = prevIdxRef.current
    let d = clamped > prev ? 1 : -1
    if (prev === n - 1 && clamped === 0) d = 1
    if (prev === 0 && clamped === n - 1) d = -1
    setDirection(d)
    setIdx(clamped)
    prevIdxRef.current = clamped
    onGoTo(clamped)
  }, [onGoTo])

  const frame = FRAMES[idx]
  const SlideContent = SLIDE_MAP[frame?.id ?? 'about']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.38 }}
      style={{ position: 'fixed', inset: 0, zIndex: 40, background: '#080808', overflow: 'hidden' }}
    >
      <div aria-hidden="true" className="slide-grain" />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={frame?.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: 'absolute', inset: 0 }}
        >
          {SlideContent && <SlideContent />}
        </motion.div>
      </AnimatePresence>

      {/* Left arrow */}
      <motion.button
        onClick={() => navigate(idx - 1)}
        aria-label="Previous slide"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          height: 130, width: 60, background: 'rgba(0,0,0,0.22)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '0 8px 8px 0', zIndex: 10,
        }}
      >
        <motion.span whileHover={{ x: -2 }} style={{ fontSize: 32, color: 'rgba(242,237,230,0.38)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>‹</motion.span>
      </motion.button>

      {/* Right arrow */}
      <motion.button
        onClick={() => navigate(idx + 1)}
        aria-label="Next slide"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          height: 130, width: 60, background: 'rgba(0,0,0,0.22)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '8px 0 0 8px', zIndex: 10,
        }}
      >
        <motion.span whileHover={{ x: 2 }} style={{ fontSize: 32, color: 'rgba(242,237,230,0.38)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>›</motion.span>
      </motion.button>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
          padding: '18px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.52), transparent)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: '#c8a96e', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase' }}>{frame?.number}</span>
          <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{frame?.label}</span>
        </div>
        <motion.button
          style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '5px 14px',
            cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', pointerEvents: 'all',
          }}
          whileHover={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
        >Exit · Esc</motion.button>
      </motion.div>

      {/* Bottom dots */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {FRAMES.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => navigate(i)}
              title={f.label}
              animate={{
                width: i === idx ? 28 : 6,
                opacity: i === idx ? 1 : 0.22,
                backgroundColor: i === idx ? '#c8a96e' : 'rgba(255,255,255,0.55)',
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <kbd style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, padding: '1px 6px' }}>←</kbd>
          <kbd style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, padding: '1px 6px' }}>→</kbd>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.06em' }}>navigate</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
