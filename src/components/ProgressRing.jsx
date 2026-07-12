// SVG donut that splits the ring into colored segments. Each segment is
// { value, colorClass, label }; colorClass sets the arc color via currentColor
// so it stays theme-aware. The center shows the total count.
export default function ProgressRing({ segments = [], size = 200, stroke = 16, caption }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0)

  let cumulative = 0

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-100 dark:text-slate-700"
        />
        {total > 0 &&
          segments.map((s) => {
            if (!s.value || s.value <= 0) return null
            const arc = (s.value / total) * circumference
            const offset = -(cumulative / total) * circumference
            cumulative += s.value
            return (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeDasharray={`${arc} ${circumference - arc}`}
                strokeDashoffset={offset}
                className={`${s.colorClass} transition-[stroke-dasharray,stroke-dashoffset] duration-700 ease-out`}
              />
            )
          })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{total}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          {caption ?? (total === 1 ? 'Assignment' : 'Assignments')}
        </span>
      </div>
    </div>
  )
}
