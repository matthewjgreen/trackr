// Color tokens used across the app. Class strings are written out in full (no
// interpolation) so Tailwind's JIT keeps them in the build. `soft`/`pill` carry
// dark-mode variants so colored chips read well on the deep-navy surfaces.

export const COLOR_ACCENTS = {
  blue: {
    bar: 'bg-brand-500',
    dot: 'bg-brand-500',
    chipBg: 'bg-brand-50 dark:bg-brand-500/15',
    chipText: 'text-brand-600 dark:text-brand-300',
    pill: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
    soft: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    solid: 'border-brand-600 bg-brand-600 text-white',
  },
  emerald: {
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    chipBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    chipText: 'text-emerald-600 dark:text-emerald-300',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
    solid: 'border-emerald-500 bg-emerald-500 text-white',
  },
  amber: {
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
    chipBg: 'bg-amber-50 dark:bg-amber-500/15',
    chipText: 'text-amber-600 dark:text-amber-300',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    soft: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    solid: 'border-amber-500 bg-amber-500 text-white',
  },
  rose: {
    bar: 'bg-rose-500',
    dot: 'bg-rose-500',
    chipBg: 'bg-rose-50 dark:bg-rose-500/15',
    chipText: 'text-rose-600 dark:text-rose-300',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    soft: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
    solid: 'border-rose-500 bg-rose-500 text-white',
  },
  violet: {
    bar: 'bg-violet-500',
    dot: 'bg-violet-500',
    chipBg: 'bg-violet-50 dark:bg-violet-500/15',
    chipText: 'text-violet-600 dark:text-violet-300',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    soft: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
    solid: 'border-violet-500 bg-violet-500 text-white',
  },
  sky: {
    bar: 'bg-sky-500',
    dot: 'bg-sky-500',
    chipBg: 'bg-sky-50 dark:bg-sky-500/15',
    chipText: 'text-sky-600 dark:text-sky-300',
    pill: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    soft: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
    solid: 'border-sky-500 bg-sky-500 text-white',
  },
  cyan: {
    bar: 'bg-cyan-500',
    dot: 'bg-cyan-500',
    chipBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    chipText: 'text-cyan-600 dark:text-cyan-300',
    pill: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
    soft: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300',
    solid: 'border-cyan-500 bg-cyan-500 text-white',
  },
  orange: {
    bar: 'bg-orange-500',
    dot: 'bg-orange-500',
    chipBg: 'bg-orange-50 dark:bg-orange-500/15',
    chipText: 'text-orange-600 dark:text-orange-300',
    pill: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    soft: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
    solid: 'border-orange-500 bg-orange-500 text-white',
  },
  slate: {
    bar: 'bg-slate-400',
    dot: 'bg-slate-400',
    chipBg: 'bg-slate-100 dark:bg-slate-500/20',
    chipText: 'text-slate-600 dark:text-slate-300',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
    soft: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
    solid: 'border-slate-500 bg-slate-500 text-white',
  },
}

// Course color choices offered in Settings.
export const COLOR_OPTIONS = ['blue', 'emerald', 'amber', 'rose', 'violet', 'sky']

export function accentFor(color) {
  return COLOR_ACCENTS[color] ?? COLOR_ACCENTS.blue
}

// Assignment type → accent color, matching the redesign mockup
// (Project = blue, Quiz = amber, Reading/Paper = violet, …).
export const TYPE_COLORS = {
  Project: 'blue',
  Quiz: 'cyan', // distinct from the amber "In Progress" status
  Exam: 'rose',
  Test: 'rose', // legacy alias for Exam
  Homework: 'orange', // distinct from the green "Completed" status
  Paper: 'violet',
  Application: 'sky',
  Other: 'slate',
}

export function typeAccent(type) {
  return accentFor(TYPE_COLORS[type] ?? 'slate')
}
