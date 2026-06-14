'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS } from '@/lib/content'
import {
  AboutScene, WorkScene, ServicesScene, ProcessScene,
  ExperienceScene, ToolkitScene, ContactScene,
} from './scenes'

const SCENES: Record<string, (props: { index: number }) => React.ReactElement> = {
  about: AboutScene,
  work: WorkScene,
  services: ServicesScene,
  process: ProcessScene,
  experience: ExperienceScene,
  toolkit: ToolkitScene,
  contact: ContactScene,
}

export default function MobileApp() {
  const reelRef = useRef<HTMLDivElement>(null)
  const sceneRefs = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [intro, setIntro] = useState(true)

  // Brief cinematic intro overlay (skipped when the user prefers reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntro(false)
      return
    }
    const t = setTimeout(() => setIntro(false), 1100)
    return () => clearTimeout(t)
  }, [])

  // Track the active scene as a >50%-visible section within the reel
  useEffect(() => {
    const reel = reelRef.current
    if (!reel) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index)
            if (!Number.isNaN(idx)) setActive(idx)
          }
        }
      },
      { root: reel, threshold: 0.5 }
    )
    sceneRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Scroll progress bar (rAF-throttled)
  useEffect(() => {
    const reel = reelRef.current
    if (!reel) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const max = reel.scrollHeight - reel.clientHeight
        setProgress(max > 0 ? reel.scrollTop / max : 0)
        raf = 0
      })
    }
    reel.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      reel.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = (i: number) => {
    sceneRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const counter = String(active + 1).padStart(2, '0')

  return (
    <>
      {/* Film sprocket rails */}
      <div className="sprocket-rail left" aria-hidden />
      <div className="sprocket-rail right" aria-hidden />
      <div className="mobile-grain" aria-hidden />

      {/* Scroll progress */}
      <motion.div
        className="m-scroll-progress"
        style={{ width: '100%', scaleX: progress }}
        aria-hidden
      />

      {/* Top status bar */}
      <div className="m-topbar">
        <span style={{ fontSize: 12, fontWeight: 700, color: '#807b73', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
          KSP<span style={{ color: '#c8a96e' }}>·</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#56524c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {SECTIONS[active].label}
          </span>
          <span className="m-num" style={{ fontSize: 10 }}>{counter} / 07</span>
        </span>
      </div>

      {/* The reel */}
      <div className="mobile-reel" ref={reelRef}>
        {SECTIONS.map((s, i) => {
          const Scene = SCENES[s.id]
          return (
            <section
              key={s.id}
              className="mobile-scene"
              data-index={i}
              ref={(el) => { sceneRefs.current[i] = el }}
            >
              <Scene index={i} />
            </section>
          )
        })}
      </div>

      {/* Bottom jump nav */}
      <div className="m-nav">
        <div className="m-nav-dots">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`m-dot${i === active ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to ${s.label}`}
            />
          ))}
        </div>
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <a className="m-nav-cta" href="/resume" target="_blank" rel="noopener noreferrer">Resume ↗</a>
      </div>

      {/* Cinematic intro overlay */}
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 60, background: '#050505',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            }}
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.28em' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 10, color: '#56524c', textTransform: 'uppercase' }}
            >
              A Kishan S. Patel Film
            </motion.p>
            <div style={{ width: 140, height: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                style={{ height: '100%', background: '#c8a96e' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
