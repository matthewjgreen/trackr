import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import Calendar from '../pages/Calendar.jsx'
import Assignments from '../pages/Assignments.jsx'

// The swipeable sections, in the same order as the mobile nav bar.
const SECTIONS = [
  { path: '/', el: <Dashboard /> },
  { path: '/calendar', el: <Calendar /> },
  { path: '/assignments', el: <Assignments /> },
]

// A horizontal, finger-following carousel of the main sections. Uses native
// CSS scroll-snap so drags track the finger and snap on release; the settled
// panel is synced back to the router (and nav taps scroll here).
export default function SectionSlider({ index }) {
  const navigate = useNavigate()
  const trackRef = useRef(null)
  const settleTimer = useRef(null)
  const didInit = useRef(false)

  // Keep the visible panel aligned with the current route (nav taps + mount).
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const target = index * el.clientWidth
    if (Math.abs(el.scrollLeft - target) > 2) {
      el.scrollTo({ left: target, behavior: didInit.current ? 'smooth' : 'auto' })
    }
    didInit.current = true
  }, [index])

  // When scrolling settles on a panel, update the route to match.
  function handleScroll() {
    const el = trackRef.current
    if (!el) return
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const w = el.clientWidth || 1
      const nearest = Math.round(el.scrollLeft / w)
      if (nearest !== index && SECTIONS[nearest]) {
        navigate(SECTIONS[nearest].path)
      }
    }, 120)
  }

  useEffect(() => () => settleTimer.current && clearTimeout(settleTimer.current), [])

  return (
    <div
      ref={trackRef}
      onScroll={handleScroll}
      className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
    >
      {SECTIONS.map((s) => (
        <section
          key={s.path}
          className="no-scrollbar h-full min-w-full shrink-0 snap-start overflow-y-auto overflow-x-hidden pb-24"
        >
          {s.el}
        </section>
      ))}
    </div>
  )
}
