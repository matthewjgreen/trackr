import { useEffect, useState } from 'react'

// True on viewports below Tailwind's `md` breakpoint (matches where the mobile
// nav / layout is used).
export function useIsMobile() {
  const query = '(max-width: 767px)'
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
