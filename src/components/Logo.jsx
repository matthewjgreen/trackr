// Trackr logo mark: a pencil on a light rounded badge (matches the mockup).
export default function Logo({ size = 30, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#ffffff" stroke="#e2e8f0" />
      <g transform="rotate(38 24 24)">
        {/* eraser */}
        <rect x="19.5" y="8.5" width="9" height="6" rx="2.6" fill="#f4a6c0" />
        {/* metal ferrule */}
        <rect x="19.5" y="14" width="9" height="3.2" fill="#cbd5e1" />
        {/* body */}
        <rect x="19.5" y="16.8" width="9" height="16.4" fill="#f6b93b" />
        {/* body shading */}
        <rect x="19.5" y="16.8" width="2.9" height="16.4" fill="#e5a72c" />
        {/* wood tip */}
        <path d="M19.5 33.2 H28.5 L24 39.6 Z" fill="#e7c9a0" />
        {/* graphite point */}
        <path d="M22.4 37.3 H25.6 L24 39.6 Z" fill="#334155" />
      </g>
    </svg>
  )
}
