export function Spinner({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingBlock({ label, className = 'h-40' }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-3 rounded-2xl border border-line bg-surface/50 text-sm text-mist ${className}`}
    >
      <Spinner className="size-5 text-torii" />
      {label}
    </div>
  );
}
