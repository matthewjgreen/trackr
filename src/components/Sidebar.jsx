import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Modal from './Modal.jsx'
import Logo from './Logo.jsx'
import {
  DashboardIcon, CalendarIcon, ListIcon, SettingsIcon,
  PlusIcon, HelpIcon, LogoutIcon,
} from './Icons.jsx'

const nav = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { to: '/assignments', label: 'Assignments', icon: ListIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white px-4 py-6 dark:border-ink-border dark:bg-ink-card">
      <Link to="/" className="mb-9 flex items-center gap-2.5 rounded-xl px-2 transition hover:opacity-80">
        <Logo size={32} />
        <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">Trackr</h1>
      </Link>

      <nav className="flex-1 space-y-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-brand-50 text-brand-600 after:absolute after:right-0 after:top-1/2 after:h-6 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-brand-600 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => navigate('/assignments/new')}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
      >
        <PlusIcon className="h-5 w-5" />
        Add Assignment
      </button>

      <div className="mt-6 space-y-1 border-t border-slate-100 pt-4 dark:border-ink-border">
        <button
          onClick={() => setShowHelp(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <HelpIcon className="h-5 w-5" /> Help
        </button>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <LogoutIcon className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="Need help?">
        If you have any questions, text or call Matthew J. Green. You should have his number.
      </Modal>
    </>
  )
}
