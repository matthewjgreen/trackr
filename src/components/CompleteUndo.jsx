import { useState, useRef, useEffect, useCallback } from 'react'
import { CheckCircleIcon } from './Icons.jsx'

// How long the "Undo?" banner stays before the assignment settles into its
// completed state.
const UNDO_MS = 6000

// Tracks assignments the user just marked completed so the list row can be
// briefly replaced by a confirmation banner with an "Undo?" link. The pending
// state lives above the row (rows get re-bucketed/filtered out when completed,
// which would otherwise unmount any local state) and maps id -> previous status
// so undo can restore it.
export function useCompleteUndo(setStatus) {
  const [pending, setPending] = useState({})
  const timers = useRef({})

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const clear = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setPending((p) => {
      if (!(id in p)) return p
      const next = { ...p }
      delete next[id]
      return next
    })
  }, [])

  // Use in place of setStatus for list rows. Marking an assignment completed
  // (from a non-completed state) opens the undo window; any other change closes
  // it. The real status change is always applied immediately.
  const changeStatus = useCallback(
    (assignment, next) => {
      if (next === 'completed' && assignment.status !== 'completed') {
        setPending((p) => ({ ...p, [assignment.id]: assignment.status }))
        clearTimeout(timers.current[assignment.id])
        timers.current[assignment.id] = setTimeout(() => clear(assignment.id), UNDO_MS)
      } else {
        clear(assignment.id)
      }
      setStatus(assignment.id, next)
    },
    [setStatus, clear]
  )

  const undo = useCallback(
    (id) => {
      const prev = pending[id]
      if (prev === undefined) return
      setStatus(id, prev)
      clear(id)
    },
    [pending, setStatus, clear]
  )

  return { pending, changeStatus, undo }
}

// The banner shown in place of a row while its undo window is open.
export function CompletedBanner({ title, onUndo }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 shadow-card dark:border-emerald-500/20 dark:bg-emerald-500/10">
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        <CheckCircleIcon className="h-5 w-5 shrink-0" />
        <span className="truncate">
          Marked <span className="font-bold">{title}</span> completed.
        </span>
      </span>
      <button
        onClick={onUndo}
        className="shrink-0 text-sm font-bold text-emerald-700 underline underline-offset-2 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
      >
        Undo?
      </button>
    </li>
  )
}
