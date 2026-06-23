// Small shared UI building blocks.

export function RoleBar({ device, role, sub, accent = '#ec2127', right }) {
  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur"
      style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.02)' }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-white"
        style={{ background: accent }}
      >
        {device}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold leading-tight text-ink">{role}</div>
        {sub && <div className="truncate text-[11px] text-ink-soft">{sub}</div>}
      </div>
      {right}
    </div>
  )
}

export function Tag({ children, color }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}14`, color }}
    >
      {children}
    </span>
  )
}

export function SectionLabel({ children }) {
  return (
    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-mute">
      {children}
    </div>
  )
}

export function Brand({ small, sub = 'Experience' }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-lg bg-true font-bold text-white ${
          small ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-lg'
        }`}
      >
        T
      </div>
      <div className={`font-bold tracking-tight text-ink ${small ? 'text-sm' : 'text-base'}`}>
        True <span className="font-medium text-ink-soft">{sub}</span>
      </div>
    </div>
  )
}
