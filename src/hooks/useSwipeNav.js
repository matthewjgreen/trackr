import { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// The swipeable top-level sections, in the same order as the mobile nav bar.
const SECTIONS = ['/', '/calendar', '/assignments']

const MIN_DISTANCE = 60 // px a horizontal swipe must travel
const H_OVER_V = 1.5 // horizontal must dominate vertical by this factor

// Left/right swipe on touch devices to move between the main sections.
export function useSwipeNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const start = useRef(null)

  function onTouchStart(e) {
    if (e.touches.length !== 1) {
      start.current = null
      return
    }
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
  }

  function onTouchEnd(e) {
    const s = start.current
    start.current = null
    if (!s) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    const dy = t.clientY - s.y
    // Ignore short swipes and anything that's more vertical than horizontal.
    if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * H_OVER_V) return

    const idx = SECTIONS.indexOf(location.pathname)
    if (idx === -1) return // not on a swipeable section
    const nextIdx = dx < 0 ? idx + 1 : idx - 1
    if (nextIdx < 0 || nextIdx >= SECTIONS.length) return // clamp at the ends

    navigate(SECTIONS[nextIdx])
  }

  return { onTouchStart, onTouchEnd }
}
