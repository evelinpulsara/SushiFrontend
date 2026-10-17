'use client';

import { Minus, Plus } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { ALLERGENS, type Allergen } from '@/domain/models';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const CONTROL =
  'w-full rounded-xl border border-line-strong bg-ink-soft px-4 py-2.5 text-sm text-ivory placeholder:text-smoke ' +
  'transition focus:border-torii/70 focus:outline-none focus:ring-2 focus:ring-torii/20';

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-medium tracking-wide text-mist uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-smoke">{hint}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${CONTROL} min-h-24 resize-y ${props.className ?? ''}`} />;
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-ink-soft p-1" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="−"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid size-9 place-items-center rounded-full text-mist transition hover:bg-surface-raised hover:text-ivory disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <output aria-live="polite" className="w-10 text-center font-display text-xl font-semibold text-ivory">
        {value}
      </output>
