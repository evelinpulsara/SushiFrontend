import type { SVGProps } from 'react';

export function ToriiMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <path d="M4 10.5c6 2 34 2 40 0l-1.6 5.2c-6 1.4-30.8 1.4-36.8 0L4 10.5Z" fill="currentColor" />
      <rect x="9" y="19" width="30" height="3.4" rx="1" fill="currentColor" />
      <rect x="12.5" y="15" width="3.6" height="29" rx="1.2" fill="currentColor" />
      <rect x="31.9" y="15" width="3.6" height="29" rx="1.2" fill="currentColor" />
      <rect x="22.4" y="15.5" width="3.2" height="5" fill="currentColor" />
    </svg>
  );
}

export function Enso({ className = '', animated = true }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <path
        d="M152 46c-30-26-86-22-110 16-22 34-10 86 32 100 40 14 86-6 96-46 6-24-2-44-14-58"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="1200"
        className={animated ? 'animate-draw' : undefined}
        style={{ strokeDashoffset: 0 }}
      />
      <path
        d="M156 50c-2-2-3-3-5-5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function VerticalKanji({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`writing-vertical font-display select-none ${className}`}>
      {text}
    </span>
  );
}

export function HankoDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line-strong" />
      <span className="size-1.5 rotate-45 bg-torii" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line-strong" />
    </div>
  );
}
