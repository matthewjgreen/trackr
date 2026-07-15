import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'

// Full-screen branded loading screen shown while the app boots. When `done`
// flips true it fades out over 500ms, then unmounts — so it never pops away.
export default function SplashScreen({ done = false }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setVisible(false), 600)
    return () => clearTimeout(t)
  }, [done])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-slate-50 transition-opacity duration-500 ease-out dark:bg-ink ${
        done ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <Logo size={52} />
        <span className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Trackr
        </span>
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
      <p className="text-sm font-medium text-slate-400">Loading your work…</p>
    </div>
  )
}
