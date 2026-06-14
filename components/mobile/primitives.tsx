'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, animate, useInView } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1] as const

/** Fade/slide/de-blur in when scrolled into view (once). */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Section header: "0N / 07" + display title + gold divider + optional meta. */
export function SceneHead({
  index,
  title,
  meta,
}: {
  index: number
  title: string
  meta?: ReactNode
}) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="m-num">{num} / 07</span>
          <h2 className="m-title">{title}</h2>
        </div>
        {meta ? <div className="m-meta">{meta}</div> : null}
      </div>
      <div className="m-divider" />
    </Reveal>
  )
}

/** Bordered tag. */
export function Chip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="m-chip" style={style}>
      {children}
    </span>
  )
}

/** Counts up from 0 to `value` when scrolled into view. */
export function CountUp({
  value,
  suffix = '',
  style,
}: {
  value: number
  suffix?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return
    const ctrl = animate(0, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = Math.round(v) + suffix
      },
    })
    return ctrl.stop
  }, [inView, value, suffix])

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      0{suffix}
    </span>
  )
}
