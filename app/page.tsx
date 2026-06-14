'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Canvas, { type CanvasHandle } from '@/components/Canvas'
import BottomNav from '@/components/BottomNav'
import PresentationSlides from '@/components/PresentationSlides'
import MobileApp from '@/components/mobile/MobileApp'
import { FRAMES } from '@/lib/frames'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Tool } from '@/hooks/useCanvas'

/** Neutral branded splash shown until the viewport type is known. */
function Splash() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: '#080808',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.3em',
          color: '#56524c', textTransform: 'uppercase',
        }}
      >
        Kishan S. Patel
      </p>
    </div>
  )
}

export default function Page() {
  const isMobile = useIsMobile()
  const canvasRef = useRef<CanvasHandle>(null)
  const [canvasState, setCanvasState] = useState<{
    tool: Tool
    displayScale: number
    selectedId: string | null
  }>({ tool: 'select', displayScale: 38, selectedId: null })

  const [presentationMode, setPresentationMode] = useState(false)

  const handleSelect = useCallback((id: string) => {
    canvasRef.current?.flyTo(id)
  }, [])

  const handleFitAll = useCallback(() => {
    canvasRef.current?.fitAll(true)
  }, [])

  const handleTogglePresentation = useCallback(() => {
    setPresentationMode(prev => !prev)
  }, [])

  const handleExitPresentation = useCallback(() => {
    setPresentationMode(false)
  }, [])

  const handleGoToSlide = useCallback((i: number) => {
    const clamped = ((i % FRAMES.length) + FRAMES.length) % FRAMES.length
    canvasRef.current?.flyTo(FRAMES[clamped].id)
  }, [])

  const currentIndex = Math.max(
    0,
    FRAMES.findIndex(f => f.id === canvasState.selectedId)
  )

  // Viewport not yet resolved → branded splash (avoids hydration flash).
  if (isMobile === null) return <Splash />

  // Mobile gets a dedicated vertical "film reel" — the pan/zoom canvas and
  // presentation deck never mount on phones.
  if (isMobile) return <MobileApp />

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      <Canvas
        ref={canvasRef}
        onStateChange={setCanvasState}
        presentationMode={presentationMode}
        onExitPresentation={handleExitPresentation}
      />
      <BottomNav
        selectedId={canvasState.selectedId}
        presentationMode={presentationMode}
        onSelect={handleSelect}
        onFitAll={handleFitAll}
        onTogglePresentation={handleTogglePresentation}
      />
      <AnimatePresence>
        {presentationMode && (
          <PresentationSlides
            currentIndex={currentIndex}
            onGoTo={handleGoToSlide}
            onExit={handleExitPresentation}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
