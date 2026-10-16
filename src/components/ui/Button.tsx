import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-torii text-ivory shadow-[0_8px_30px_-12px_rgba(230,57,70,0.8)] hover:bg-torii-deep focus-visible:outline-torii',
  secondary: 'border border-line-strong bg-surface/60 text-ivory hover:border-mist/60 hover:bg-surface-raised',
  ghost: 'text-mist hover:bg-surface-raised hover:text-ivory',
  gold: 'border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20',
  danger: 'border border-torii/40 bg-torii/10 text-torii hover:bg-torii/20',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2.5 tracking-wide',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className = ''): string {
  return [
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98] whitespace-nowrap',
    VARIANTS[variant],
    SIZES[size],
