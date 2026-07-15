import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { AssignmentsProvider, useAssignments } from './context/AssignmentsContext.jsx'
import { NotificationsProvider } from './context/NotificationsContext.jsx'
import { NotesProvider } from './context/NotesContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import Sidebar from './components/Sidebar.jsx'
import MobileNav from './components/MobileNav.jsx'
import MobileHeader from './components/MobileHeader.jsx'
import Topbar from './components/Topbar.jsx'
import FloatingAddButton from './components/FloatingAddButton.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddAssignment from './pages/AddAssignment.jsx'
import Assignments from './pages/Assignments.jsx'
import Calendar from './pages/Calendar.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  const { session, loading } = useAuth()
  // Always show the splash briefly on open, even if auth resolves instantly.
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100)
    return () => clearTimeout(t)
  }, [])

  // Logged out (or auth still resolving): show Login with the splash on top
  // until auth has resolved and the minimum boot time has passed.
  if (!session) {
    return (
      <>
        <Login />
        <SplashScreen done={!loading && !booting} />
      </>
    )
  }

  return (
    <ToastProvider>
      <AssignmentsProvider>
        <NotificationsProvider>
          <NotesProvider>
            <AuthedApp booting={booting} />
          </NotesProvider>
        </NotificationsProvider>
      </AssignmentsProvider>
    </ToastProvider>
  )
}

function AuthedApp({ booting }) {
  const location = useLocation()
  const { loading: dataLoading } = useAssignments()
  // The mobile "+" button is hidden where adding inline doesn't make sense.
  const hideFab = ['/assignments/new', '/calendar', '/settings'].some((p) =>
    location.pathname.startsWith(p)
  )

  return (
    <>
      <div className="flex min-h-screen md:h-screen bg-slate-50 dark:bg-ink">
        <Sidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <MobileHeader />
          <Topbar />

          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-24 md:pb-0">
            <div key={location.pathname} className="animate-[fadeIn_.15s_ease-out]">
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/assignments/new" element={<AddAssignment />} />
                <Route path="/assignments/:id/edit" element={<AddAssignment />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>

        {!hideFab && <FloatingAddButton />}
        <MobileNav />
      </div>

      {/* Stays until the user's data has actually loaded, then fades out. */}
      <SplashScreen done={!booting && !dataLoading} />
    </>
  )
}
