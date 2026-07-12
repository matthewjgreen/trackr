// Relative due-date label + color tone + time bucket for an assignment.
// Used for the colored due badges and the time-grouped Assignments list.
import { isStudyType } from './status.js'

export function dueMeta(dueDate, type) {
  const due = new Date(dueDate)
  const now = new Date()
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const days = Math.round((startOfDay(due) - startOfDay(now)) / 86400000)
  const ms = due - now

  const amber = 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
  const rose = 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
  const slate = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'

  const dateLabel = due.toLocaleDateString([], { month: 'short', day: 'numeric' })

  if (ms < 0) {
    // Quizzes/exams are study items, not deadlines — they're never "overdue".
    // A past one just shows its date neutrally.
    if (isStudyType(type)) return { bucket: 'later', tone: slate, label: dateLabel }
    const ago = Math.abs(days)
    return { bucket: 'overdue', tone: rose, label: ago <= 0 ? 'Overdue' : `Overdue · ${ago}d` }
  }
  if (days === 0) {
    const hrs = Math.round(ms / 3600000)
    return { bucket: 'today', tone: amber, label: hrs <= 1 ? 'Due soon' : `Due in ${hrs}h` }
  }
  if (days === 1) return { bucket: 'week', tone: amber, label: 'Tomorrow' }
  if (days <= 7) return { bucket: 'week', tone: slate, label: `In ${days} days` }
  return {
    bucket: 'later',
    tone: slate,
    label: due.toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }
}

// Order + labels for the grouped Assignments list. Completed items bucket last.
export const DUE_BUCKETS = [
  { key: 'overdue', label: 'Overdue' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'later', label: 'Later' },
  { key: 'completed', label: 'Completed' },
]

export function bucketFor(assignment) {
  if (assignment.status === 'completed') return 'completed'
  return dueMeta(assignment.dueDate, assignment.type).bucket
}
