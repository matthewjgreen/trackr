import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAssignments, courseById } from '../context/AssignmentsContext.jsx'
import { accentFor, typeAccent } from '../lib/accents.js'
import { dueMeta, bucketFor, DUE_BUCKETS } from '../lib/due.js'
import StatusSelect from '../components/StatusSelect.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonRows } from '../components/Skeleton.jsx'
import { SearchIcon, ListIcon, EditIcon, TrashIcon, typeIcon } from '../components/Icons.jsx'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'not_started', label: 'Not Started' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

export default function Assignments() {
  const { assignments, courses, setStatus, updateAssignment, removeAssignment, loading } = useAssignments()
  const navigate = useNavigate()

  function setProblems(a, n) {
    const done = Math.max(0, Math.min(a.totalProblems, n))
    // Keep status in sync with problem progress: all done → completed,
    // some done → in progress, none → not started.
    const status = done >= a.totalProblems ? 'completed' : done > 0 ? 'in_progress' : 'not_started'
    updateAssignment(a.id, { completedProblems: done, status })
  }
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  function onQueryChange(value) {
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const term = query.trim().toLowerCase()

  const filtered = assignments
    .filter((a) => (filter === 'all' ? true : a.status === filter))
    .filter((a) => {
      if (!term) return true
      const course = courseById(courses, a.courseId)
      const haystack = [a.title, a.subtitle, a.type, course?.name, a.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  // Group into Overdue / Today / This week / Later / Completed.
  const grouped = DUE_BUCKETS.map((b) => ({
    ...b,
    items: filtered.filter((a) => bucketFor(a) === b.key),
  })).filter((g) => g.items.length > 0)

  function renderRow(a) {
    const Icon = typeIcon[a.type] ?? typeIcon.Homework
    const course = courseById(courses, a.courseId)
    const accent = accentFor(course?.color)
    const tone = typeAccent(a.type)
    const done = a.status === 'completed'
    const dm = dueMeta(a.dueDate, a.type)
    return (
      <li
        key={a.id}
        className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-card dark:border-ink-border dark:bg-ink-card sm:p-4"
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.soft}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className={`min-w-0 text-sm font-bold break-words ${done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                {a.title}
              </p>
              <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5">
                <button
                  onClick={() => navigate(`/assignments/${a.id}/edit`)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700 dark:hover:text-brand-300"
                  title="Edit"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeAssignment(a.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <StatusSelect value={a.status} type={a.type} onChange={(s) => setStatus(a.id, s)} />
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone.soft}`}>
                {a.type}
              </span>
              {course && (
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${accent.soft}`}>
                  {course.name}
                </span>
              )}
              {!done && (
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${dm.tone}`}>
                  {dm.label}
                </span>
              )}
              {a.priority === 'Critical' && !done && (
                <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
                  Critical
                </span>
              )}
            </div>

            {a.totalProblems > 0 && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => setProblems(a, a.completedProblems - 1)}
                    disabled={a.completedProblems <= 0}
                    className="px-2.5 py-1 text-sm font-bold text-slate-500 transition hover:text-brand-600 disabled:opacity-30 dark:text-slate-300"
                    title="One fewer done"
                  >
                    −
                  </button>
                  <span className="min-w-[3rem] text-center text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                    {a.completedProblems}/{a.totalProblems}
                  </span>
                  <button
                    onClick={() => setProblems(a, a.completedProblems + 1)}
                    disabled={a.completedProblems >= a.totalProblems}
                    className="px-2.5 py-1 text-sm font-bold text-slate-500 transition hover:text-brand-600 disabled:opacity-30 dark:text-slate-300"
                    title="One more done"
                  >
                    +
                  </button>
                </div>
                <div className="h-1.5 flex-1 max-w-[8rem] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${Math.round((a.completedProblems / a.totalProblems) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold tabular-nums text-slate-400">
                  {Math.round((a.completedProblems / a.totalProblems) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 md:px-8">
      <div className="mb-5">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Assignments</h2>
        <p className="mt-1 text-sm text-slate-400">
          {assignments.filter((a) => a.status === 'not_started').length} not started ·{' '}
          {assignments.filter((a) => a.status === 'in_progress').length} in progress ·{' '}
          {assignments.filter((a) => a.status === 'completed').length} completed
        </p>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search assignments…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-ink-card dark:text-slate-100"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              filter === f.key
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-ink-card dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRows count={5} />
      ) : grouped.length === 0 ? (
        <EmptyState icon={ListIcon} className="bg-white py-12 dark:bg-ink-card">
          {term ? `No assignments match "${query.trim()}".` : 'No assignments yet — add your first one.'}
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => (
            <div key={g.key}>
              <div className="mb-2 flex items-center gap-2 px-1">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">{g.label}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  {g.items.length}
                </span>
              </div>
              <ul className="space-y-3">{g.items.map(renderRow)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
