import { useEffect, useRef, useState } from 'react'
import { STATUSES, statusMeta } from '../lib/status.js'

// Compact dropdown that shows an assignment's status as a colored pill and lets
// the user switch between Not Started / In Progress / Completed.
export default function StatusSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const meta = statusMeta(value)

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${meta.pill}`}
      >
        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
        <span className="whitespace-nowrap">{meta.label}</span>
        <svg viewBox="0 0 20 20" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-soft dark:border-ink-border dark:bg-ink-card">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                onChange(s.value)
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
              <span className={`flex-1 text-slate-700 dark:text-slate-200 ${value === s.value ? 'font-semibold' : ''}`}>
                {s.label}
              </span>
              {value === s.value && <span className="text-brand-600 dark:text-brand-300">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
