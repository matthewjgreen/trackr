import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssignments, courseById } from '../context/AssignmentsContext.jsx'
import { typeAccent } from '../lib/accents.js'
import { bucketFor } from '../lib/due.js'
import { isStudyType } from '../lib/status.js'
import ProgressRing from '../components/ProgressRing.jsx'
import StatusSelect from '../components/StatusSelect.jsx'
import { useCompleteUndo, CompletedBanner } from '../components/CompleteUndo.jsx'
import ProblemProgress from '../components/ProblemProgress.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonRows } from '../components/Skeleton.jsx'
import { ClockIcon, TrendIcon, EditIcon, TestIcon } from '../components/Icons.jsx'

const MONTHS3 = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// Segments of the progress donut, in draw order. `key` indexes into the stats
// object; `label` is the legend text (study wheel uses study-oriented labels).
const RING_SEGMENTS = [
  { key: 'notStarted', label: 'Not Started', colorClass: 'text-slate-300 dark:text-slate-600', dot: 'bg-slate-300 dark:bg-slate-600' },
  { key: 'inProgress', label: 'In Progress', colorClass: 'text-amber-400', dot: 'bg-amber-400' },
  { key: 'completed', label: 'Completed', colorClass: 'text-emerald-500', dot: 'bg-emerald-500' },
]

const STUDY_RING_SEGMENTS = [
  { key: 'notStarted', label: 'Need to study', colorClass: 'text-slate-300 dark:text-slate-600', dot: 'bg-slate-300 dark:bg-slate-600' },
  { key: 'inProgress', label: 'Feeling Prepared', colorClass: 'text-amber-400', dot: 'bg-amber-400' },
  { key: 'completed', label: 'Completed', colorClass: 'text-emerald-500', dot: 'bg-emerald-500' },
]

function statusCounts(items) {
  return {
    notStarted: items.filter((a) => a.status === 'not_started').length,
    inProgress: items.filter((a) => a.status === 'in_progress').length,
    completed: items.filter((a) => a.status === 'completed').length,
  }
}

// A titled card with a segmented status donut + legend. Used for both the
// overall Progress wheel and the Quizzes & Exams wheel.
function StatusWheel({ icon: Icon, iconClass, title, segments, counts, caption, footer }) {
  const total = segments.reduce((sum, s) => sum + (counts[s.key] ?? 0), 0)
  const defaultFooter =
    total === 0 ? `No ${title.toLowerCase()} yet.` : `${counts.completed ?? 0} of ${total} completed.`
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconClass}`} />
        <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-ink-border dark:bg-ink-card">
        <div className="flex flex-col items-center gap-6">
          <ProgressRing caption={caption} segments={segments.map((s) => ({ ...s, value: counts[s.key] ?? 0 }))} />
          <div className="grid w-full grid-cols-3 gap-2">
            {segments.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <span className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                  <span className="text-lg font-extrabold leading-none text-slate-800 dark:text-slate-100">
                    {counts[s.key] ?? 0}
                  </span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-slate-400">{footer ?? defaultFooter}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { assignments, courses, stats, setStatus, loading } = useAssignments()
  const navigate = useNavigate()
  const { pending, changeStatus, undo } = useCompleteUndo(setStatus)

  // Anything not completed that's overdue, due today, or due within 7 days.
  // Assignments in their undo window are kept in place so the banner can show.
  const NEAR_TERM = ['overdue', 'today', 'week']
  const deadlines = [...assignments]
    .filter((a) => a.id in pending || NEAR_TERM.includes(bucketFor(a)))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  const studyStats = statusCounts(assignments.filter((a) => isStudyType(a.type)))

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
                if (a.id in pending) {
                  return <CompletedBanner key={a.id} title={a.title} onUndo={() => undo(a.id)} />
                }
                const course = courseById(courses, a.courseId)
                const tone = typeAccent(a.type)
                const due = new Date(a.dueDate)
                return (
                  <Fragment key={a.id}>
                  {/* Desktop: original row */}
                  <li className="relative hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-ink-border dark:bg-ink-card md:block">
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
                        <StatusSelect value={a.status} type={a.type} onChange={(s) => changeStatus(a, s)} />
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

                  {/* Mobile: stacked card */}
                  <li className="relative rounded-2xl border border-slate-200 bg-white p-4 pl-5 shadow-card dark:border-ink-border dark:bg-ink-card md:hidden">
                    <span className={`absolute inset-y-0 left-0 w-1.5 rounded-l-2xl ${tone.bar}`} />
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-200">
                        <span className="text-[10px] font-bold tracking-wide">{MONTHS3[due.getMonth()]}</span>
                        <span className="text-lg font-extrabold leading-none">{due.getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 break-words text-[15px] font-bold text-slate-800 dark:text-slate-100">
                            {a.title}
                          </p>
                          <button
                            onClick={() => navigate(`/assignments/${a.id}/edit`)}
                            className="-mr-1 -mt-1 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700 dark:hover:text-brand-300"
                            title="Edit"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-400">
                          {(a.notes || course) && (
                            <span className="min-w-0 truncate">{a.notes || course?.name}</span>
                          )}
                          <span className="flex shrink-0 items-center gap-1 text-xs">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <StatusSelect value={a.status} type={a.type} onChange={(s) => changeStatus(a, s)} />
                          <ProblemProgress done={a.completedProblems} total={a.totalProblems} />
                        </div>
                      </div>
                    </div>
                  </li>
                  </Fragment>
                )
              })}
            </ul>
          )}
        </section>

        {/* Progress wheels */}
        <section className="space-y-6">
          <StatusWheel
            icon={TrendIcon}
            iconClass="text-mint-500"
            title="Progress"
            segments={RING_SEGMENTS}
            counts={stats}
            footer={
              stats.total === 0
                ? 'No assignments yet.'
                : `${stats.completed} of ${stats.total} assignments completed.`
            }
          />
          <StatusWheel
            icon={TestIcon}
            iconClass="text-rose-500"
            title="Quizzes & Exams"
            caption="Quizzes & Exams"
            segments={STUDY_RING_SEGMENTS}
            counts={studyStats}
          />
        </section>
      </div>
    </div>
  )
}
