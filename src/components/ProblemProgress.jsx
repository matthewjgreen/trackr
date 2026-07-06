// Read-only mini progress bar + "done/total" for an assignment's problem set.
// Renders nothing when the assignment has no problem count.
export default function ProblemProgress({ done, total, className = '' }) {
  if (!total || total <= 0) return null
  const pct = Math.round((Math.min(done, total) / total) * 100)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="shrink-0 text-[10px] font-semibold tabular-nums text-slate-400">
        {done}/{total}
      </span>
    </div>
  )
}
