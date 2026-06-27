// Pulsing placeholder rows shown while assignments load from Supabase.
export function SkeletonRows({ count = 4 }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-slate-800"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700/60" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </li>
      ))}
    </ul>
  )
}
