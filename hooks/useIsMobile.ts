'use client'

import { useEffect, useState } from 'react'

/**
 * SSR-safe viewport detector. Returns `null` until mounted (so the caller can
 * render a neutral splash and avoid a hydration mismatch), then `true`/`false`.
 *
 * "Mobile" = narrow viewport OR a coarse (touch) primary pointer — this catches
 * phones in landscape too, where width alone would misclassify them as desktop.
 */
export function useIsMobile(breakpoint = 768): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${breakpoint}px), (pointer: coarse) and (max-width: 1024px)`
    )
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return isMobile
}
