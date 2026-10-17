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
