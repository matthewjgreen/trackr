import Logo from './Logo.jsx'

// Full-screen branded loading screen shown while the app boots.
export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-ink">
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
