import { useState, useEffect } from 'react'
import { breakpoints } from '../utils/tokens'

/**
 * useMediaQuery — returns true if the viewport matches a given min-width
 * @param {number} minWidth — breakpoint in pixels
 */
export function useMediaQuery(minWidth) {
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= minWidth : false
  )

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`)
    const handler = (e) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [minWidth])

  return matches
}

/**
 * Convenience hooks for common breakpoints
 */
export const useIsDesktop = () => useMediaQuery(breakpoints.lg)
export const useIsTablet = () => useMediaQuery(breakpoints.md)
export const useIsMobile = () => !useMediaQuery(breakpoints.sm)
