import { Link } from 'react-router-dom'
import AvatarMenu from './AvatarMenu.jsx'
import NotificationsBell from './NotificationsBell.jsx'
import NotesPanel from './NotesPanel.jsx'
import Logo from './Logo.jsx'

// Top bar shown only on mobile (desktop uses the sidebar + Topbar instead).
export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur md:hidden dark:border-ink-border dark:bg-ink-card/95">
      <Link to="/" className="flex items-center gap-2">
        <Logo size={28} />
        <h1 className="font-display text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white">Trackr</h1>
      </Link>
      <div className="flex items-center gap-3">
        <NotesPanel />
        <NotificationsBell />
        <AvatarMenu size={32} />
      </div>
    </header>
  )
}
