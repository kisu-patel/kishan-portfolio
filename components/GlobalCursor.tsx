'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

interface Ripple { id: number; x: number; y: number }

export default function GlobalCursor() {
  const mx = useMotionValue(-300)
  const my = useMotionValue(-300)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])

  // Dot: nearly instant
  const dx = useSpring(mx, { damping: 65, stiffness: 2400, mass: 0.04 })
  const dy = useSpring(my, { damping: 65, stiffness: 2400, mass: 0.04 })

  // Ring: lags behind
  const rx = useSpring(mx, { damping: 22, stiffness: 185, mass: 0.22 })
  const ry = useSpring(my, { damping: 22, stiffness: 185, mass: 0.22 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      const el = e.target as Element
      const isGrabArea = !!el.closest('.cursor-grab, .cursor-grabbing')
      const isGrabbingNow = (el as HTMLElement).style?.cursor === 'grabbing' ||
        !!(el as HTMLElement).closest?.('[style*="cursor: grabbing"]')
      setGrabbing(isGrabArea)
      setHovering(!isGrabArea && !!el.closest('a, button, [role="button"], label, [data-hover]'))
      if (isGrabbingNow && clicking) setGrabbing(true)
    }
    const onDown = (e: MouseEvent) => {
      setClicking(true)
      const el = e.target as Element
      if (el.closest('.cursor-grab')) setGrabbing(true)
      setRipples(r => [...r.slice(-5), { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }])
    }
    const onUp = () => { setClicking(false); setGrabbing(false) }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [mx, my])

  return (
    <>
      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ width: 6, height: 6, opacity: 0.65 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => setRipples(p => p.filter(x => x.id !== r.id))}
            style={{
              position: 'fixed', left: r.x, top: r.y,
              borderRadius: '50%', border: '1px solid rgba(200,169,110,0.6)',
              pointerEvents: 'none', zIndex: 9995,
              translateX: '-50%', translateY: '-50%',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Lagging ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: rx, top: ry,
          translateX: '-50%', translateY: '-50%',
          borderRadius: '50%',
          border: '1.5px solid rgba(200,169,110,0.46)',
          pointerEvents: 'none', zIndex: 9996,
        }}
        animate={{
          width: grabbing ? 52 : hovering ? 46 : 30,
          height: grabbing ? 52 : hovering ? 46 : 30,
          opacity: grabbing ? 0.65 : hovering ? 0.9 : 0.52,
          borderColor: grabbing ? 'rgba(200,169,110,0.28)' : hovering ? 'rgba(200,169,110,0.75)' : 'rgba(200,169,110,0.42)',
          borderWidth: grabbing ? '1px' : '1.5px',
          scale: clicking && !grabbing ? 0.72 : 1,
        }}
        transition={{
          width: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
          height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.1 },
          opacity: { duration: 0.2 },
          borderColor: { duration: 0.2 },
          borderWidth: { duration: 0.15 },
        }}
      />

      {/* Fast center dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: dx, top: dy,
          translateX: '-50%', translateY: '-50%',
          width: 5, height: 5,
          background: '#c8a96e',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9997,
        }}
        animate={{
          scale: grabbing ? 2.4 : clicking ? 1.7 : hovering ? 0.35 : 1,
          opacity: grabbing ? 0.25 : hovering ? 0.55 : 1,
          background: grabbing ? 'rgba(200,169,110,0.4)' : hovering ? '#d4b878' : '#c8a96e',
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  )
}
