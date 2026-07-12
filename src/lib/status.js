// The three assignment statuses, with display labels and Tailwind accent
// classes used by the StatusSelect control and list rows.

export const STATUSES = [
  {
    value: 'not_started',
    label: 'Not Started',
    dot: 'bg-slate-400',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    dot: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  {
    value: 'completed',
    label: 'Completed',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
]

export const DEFAULT_STATUS = 'not_started'

export function statusMeta(value) {
  return STATUSES.find((s) => s.value === value) ?? STATUSES[0]
}

// Quiz/Exam assignments use study-oriented status labels (the underlying
// status values are unchanged, so all tracking still works). "Test" is the
// legacy alias for "Exam".
export const STUDY_TYPES = ['Quiz', 'Exam', 'Test']

export function isStudyType(type) {
  return STUDY_TYPES.includes(type)
}

const STUDY_LABELS = {
  not_started: 'Need to study',
  in_progress: 'Feeling Prepared',
  completed: 'Completed',
}

export function statusLabel(value, type) {
  if (isStudyType(type) && STUDY_LABELS[value]) return STUDY_LABELS[value]
  return statusMeta(value).label
}
