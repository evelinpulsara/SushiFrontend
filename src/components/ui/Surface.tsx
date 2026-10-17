import type { HTMLAttributes, ReactNode } from 'react';
import { Info } from 'lucide-react';
import type { TableStatus } from '@/domain/models';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-line bg-surface/80 backdrop-blur-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}

type Tone = 'neutral' | 'torii' | 'gold' | 'matcha' | 'aiiro';

const TONES: Record<Tone, string> = {
  neutral: 'border-line-strong bg-surface-raised text-mist',
  torii: 'border-torii/30 bg-torii/10 text-torii',
  gold: 'border-gold/30 bg-gold/10 text-gold',
  matcha: 'border-matcha/30 bg-matcha/10 text-matcha',
  aiiro: 'border-aiiro/40 bg-aiiro/15 text-[#8fa9d6]',
};

export function Badge({ tone = 'neutral', className = '', children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

export const STATUS_TONE: Record<TableStatus, Tone> = {
  available: 'matcha',
  occupied: 'torii',
  reserved: 'gold',
  clearing_soon: 'aiiro',
};

export const STATUS_DOT: Record<TableStatus, string> = {
  available: 'bg-matcha',
  occupied: 'bg-torii',
  reserved: 'bg-gold',
  clearing_soon: 'bg-aiiro',
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <p className={`mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-torii ${centered ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-torii/60" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl leading-tight font-semibold text-balance text-ivory sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-mist">{subtitle}</p>}
    </div>
  );
}

export function Notice({
  tone = 'error',
  children,
  action,
}: {
  tone?: 'error' | 'info' | 'success';
  children: ReactNode;
  action?: ReactNode;
}) {
  const styles = {
    error: 'border-torii/40 bg-torii/10 text-[#ffb3b9]',
    info: 'border-aiiro/40 bg-aiiro/10 text-[#b9cbea]',
    success: 'border-matcha/40 bg-matcha/10 text-[#c4e3b5]',
  }[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}
