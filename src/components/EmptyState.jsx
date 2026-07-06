// Friendly empty-state block: a soft icon bubble + a line of text.
export default function EmptyState({ icon: Icon, children, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center dark:border-ink-border ${className}`}>
      {Icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <p className="text-sm text-slate-400">{children}</p>
    </div>
  )
}
