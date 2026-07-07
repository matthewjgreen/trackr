import { useNavigate } from 'react-router-dom'
import { useAssignments, courseById } from '../context/AssignmentsContext.jsx'
import { typeAccent } from '../lib/accents.js'
import { bucketFor } from '../lib/due.js'
import ProgressRing from '../components/ProgressRing.jsx'
import StatusSelect from '../components/StatusSelect.jsx'
import ProblemProgress from '../components/ProblemProgress.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonRows } from '../components/Skeleton.jsx'
import { ClockIcon, TrendIcon, EditIcon } from '../components/Icons.jsx'

const MONTHS3 = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// Segments of the progress donut, in draw order. `key` indexes into `stats`.
const RING_SEGMENTS = [
  { key: 'notStarted', label: 'Not Started', colorClass: 'text-slate-300 dark:text-slate-600', dot: 'bg-slate-300 dark:bg-slate-600' },
  { key: 'inProgress', label: 'In Progress', colorClass: 'text-amber-400', dot: 'bg-amber-400' },
  { key: 'completed', label: 'Completed', colorClass: 'text-emerald-500', dot: 'bg-emerald-500' },
]

export default function Dashboard() {
  const { assignments, courses, stats, setStatus, loading } = useAssignments()
  const navigate = useNavigate()

  // Anything not completed that's overdue, due today, or due within 7 days.
  const NEAR_TERM = ['overdue', 'today', 'week']
  const deadlines = [...assignments]
    .filter((a) => NEAR_TERM.includes(bucketFor(a)))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  const subtitle = loading
    ? 'Loading your work…'
    : deadlines.length === 0
      ? "You're all caught up — nice work."
      : `You have ${deadlines.length} ${deadlines.length === 1 ? 'deadline' : 'deadlines'} due within a week.`

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
          Performance Hub
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming deadlines */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-brand-500" />
              <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">
                Upcoming Deadlines
              </h2>
            </div>
            <button
              onClick={() => navigate('/calendar')}
              className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              View Calendar
            </button>
          </div>

          {loading ? (
            <SkeletonRows count={3} />
          ) : deadlines.length === 0 ? (
            <EmptyState icon={ClockIcon}>Nothing coming up — you're all caught up. 🎉</EmptyState>
          ) : (
            <ul className="space-y-3">
              {deadlines.map((a) => {
                const course = courseById(courses, a.courseId)
                const tone = typeAccent(a.type)
                const due = new Date(a.dueDate)
                return (
                  <li
                    key={a.id}
                    className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-ink-border dark:bg-ink-card"
                  >
                    <span className={`absolute inset-y-0 left-0 w-1.5 rounded-l-2xl ${tone.bar}`} />
                    <div className="flex items-center gap-4 pl-2">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-200">
                        <span className="text-[10px] font-bold tracking-wide">{MONTHS3[due.getMonth()]}</span>
                        <span className="text-xl font-extrabold leading-none">{due.getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone.soft}`}>
                            {a.type}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[15px] font-bold text-slate-800 dark:text-slate-100">
                          {a.title}
                        </p>
                        {(a.notes || course) && (
                          <p className="truncate text-sm text-slate-400">{a.notes || course?.name}</p>
                        )}
                        <ProblemProgress done={a.completedProblems} total={a.totalProblems} className="mt-1.5" />
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <StatusSelect value={a.status} onChange={(s) => setStatus(a.id, s)} />
                        <button
                          onClick={() => navigate(`/assignments/${a.id}/edit`)}
                          className="rounded-lg p-1 text-slate-400 transition hover:text-brand-600 dark:hover:text-brand-300"
                          title="Edit"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Progress */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <TrendIcon className="h-5 w-5 text-mint-500" />
            <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">Progress</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-ink-border dark:bg-ink-card">
            <div className="flex flex-col items-center gap-6">
              <ProgressRing segments={RING_SEGMENTS.map((s) => ({ ...s, value: stats[s.key] ?? 0 }))} />
              <div className="grid w-full grid-cols-3 gap-2">
                {RING_SEGMENTS.map((s) => (
                  <div key={s.key} className="flex flex-col items-center gap-1 text-center">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                      <span className="text-lg font-extrabold leading-none text-slate-800 dark:text-slate-100">
                        {stats[s.key] ?? 0}
                      </span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 text-center text-xs text-slate-400">
              {stats.total === 0
                ? 'No assignments yet.'
                : `${stats.completed} of ${stats.total} assignments completed.`}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
