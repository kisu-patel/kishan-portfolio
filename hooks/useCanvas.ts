'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FRAMES, getFramesBounds } from '@/lib/frames'

export type Tool = 'select' | 'pan'

interface Transform { x: number; y: number; scale: number }

const MIN_SCALE = 0.06
const MAX_SCALE = 3

function clampScale(s: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

export function useCanvas(viewportRef: React.RefObject<HTMLDivElement | null>) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const t = useRef<Transform>({ x: 0, y: 0, scale: 0.38 })
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const spaceHeld = useRef(false)
  const toolRef = useRef<Tool>('select')
  const lockedRef = useRef(false)

  const [tool, setToolState] = useState<Tool>('select')
  const [displayScale, setDisplayScale] = useState(38)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [introComplete, setIntroComplete] = useState(false)
  const fitAllRef = useRef<(animate?: boolean) => void>(() => {})

  const setTool = useCallback((next: Tool) => {
    toolRef.current = next
    setToolState(next)
  }, [])

  // Expose lock so Canvas can freeze interactions during presentation mode
  const setLocked = useCallback((v: boolean) => {
    lockedRef.current = v
  }, [])

  const commit = useCallback((x: number, y: number, scale: number, animate = false) => {
    const el = canvasRef.current
    if (!el) return
    t.current = { x, y, scale }
    el.style.transition = animate
      ? 'transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none'
    el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
    setDisplayScale(Math.round(scale * 100))
  }, [])

  const fitAll = useCallback((animate = false) => {
    const vp = viewportRef.current
    if (!vp) return
    const vw = vp.clientWidth
    const vh = vp.clientHeight
    const b = getFramesBounds()
    const pad = 100
    const s = clampScale(Math.min((vw - pad * 2) / b.w, (vh - pad * 2) / b.h))
    commit(vw / 2 - b.cx * s, vh / 2 - b.cy * s, s, animate)
    setSelectedId(null)
  }, [viewportRef, commit])

  useEffect(() => { fitAllRef.current = fitAll }, [fitAll])

  const flyTo = useCallback((frameId: string) => {
    const f = FRAMES.find(fr => fr.id === frameId)
    const vp = viewportRef.current
    if (!f || !vp) return
    const vw = vp.clientWidth
    const vh = vp.clientHeight
    const pad = 80
    const s = clampScale(Math.min((vw - pad * 2) / f.w, (vh - pad * 2) / f.h, 1.3))
    commit(vw / 2 - (f.x + f.w / 2) * s, vh / 2 - (f.y + f.h / 2) * s, s, true)
    setSelectedId(frameId)
  }, [viewportRef, commit])

  // ── Zoom toward cursor ───────────────────────────────────────
  const zoomAt = useCallback((delta: number, cx: number, cy: number) => {
    const { x, y, scale } = t.current
    const factor = 1 - delta * 0.0008
    const ns = clampScale(scale * factor)
    const r = ns / scale
    commit(cx - (cx - x) * r, cy - (cy - y) * r, ns)
  }, [commit])

  // ── Cinematic intro: start on About, zoom out to show all ───
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const about = FRAMES.find(f => f.id === 'about')!
    const vw = vp.clientWidth
    const vh = vp.clientHeight
    const s = clampScale(Math.min((vw - 80) / about.w, (vh - 80) / about.h, 1.25))
    commit(vw / 2 - (about.x + about.w / 2) * s, vh / 2 - (about.y + about.h / 2) * s, s)

    const timer = setTimeout(() => {
      fitAllRef.current(true)
      setIntroComplete(true)
    }, 1900)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Wheel: disabled when locked ──────────────────────────────
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      if (lockedRef.current) return
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.deltaY, e.clientX, e.clientY)
      } else {
        const { x, y, scale } = t.current
        commit(x - e.deltaX, y - e.deltaY, scale)
      }
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [viewportRef, commit, zoomAt])

  // ── Pointer drag: disabled when locked ──────────────────────
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const down = (e: PointerEvent) => {
      if (lockedRef.current) return
      const shouldPan = e.button === 1 || spaceHeld.current || toolRef.current === 'pan'
      if (!shouldPan) return
      e.preventDefault()
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      vp.setPointerCapture(e.pointerId)
      vp.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      const { x, y, scale } = t.current
      commit(x + dx, y + dy, scale)
    }
    const up = () => {
      isDragging.current = false
      vp.style.cursor = ''
    }

    vp.addEventListener('pointerdown', down)
    vp.addEventListener('pointermove', move)
    vp.addEventListener('pointerup', up)
    vp.addEventListener('pointercancel', up)
    return () => {
      vp.removeEventListener('pointerdown', down)
      vp.removeEventListener('pointermove', move)
      vp.removeEventListener('pointerup', up)
      vp.removeEventListener('pointercancel', up)
    }
  }, [viewportRef, commit])

  // ── Keyboard: disabled when locked (presentation mode handles its own keys) ──
  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (lockedRef.current) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        spaceHeld.current = true
        document.body.style.cursor = 'grab'
      }
      if (e.key === 'v' || e.key === 'V') setTool('select')
      if (e.key === 'h' || e.key === 'H') setTool('pan')
      if (e.key === 'Escape') { fitAll(true) }
      if ((e.metaKey || e.ctrlKey) && e.key === '0') { e.preventDefault(); fitAll(true) }
      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        const vp = viewportRef.current
        zoomAt(-500, (vp?.clientWidth ?? 0) / 2, (vp?.clientHeight ?? 0) / 2)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault()
        const vp = viewportRef.current
        zoomAt(500, (vp?.clientWidth ?? 0) / 2, (vp?.clientHeight ?? 0) / 2)
      }
    }
    const ku = (e: KeyboardEvent) => {
      if (e.code === 'Space') { spaceHeld.current = false; document.body.style.cursor = '' }
    }
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku) }
  }, [fitAll, setTool, viewportRef, zoomAt])

  return { canvasRef, tool, setTool, displayScale, selectedId, introComplete, flyTo, fitAll, setLocked }
}
