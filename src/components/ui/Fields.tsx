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
      <button
        type="button"
        aria-label="+"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid size-9 place-items-center rounded-full text-mist transition hover:bg-surface-raised hover:text-ivory disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  disabled,
  tone = 'torii',
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  tone?: 'torii' | 'gold';
  className?: string;
}) {
  const activeStyles = tone === 'gold' ? 'border-gold/70 bg-gold/15 text-gold' : 'border-torii/70 bg-torii/15 text-ivory';
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
        active ? activeStyles : 'border-line-strong bg-ink-soft text-mist hover:border-mist/50 hover:text-ivory'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function AllergenPicker({ value, onChange }: { value: readonly Allergen[]; onChange: (value: Allergen[]) => void }) {
  const { t } = useI18n();
  const toggle = (allergen: Allergen) =>
    onChange(value.includes(allergen) ? value.filter((item) => item !== allergen) : [...value, allergen]);

  return (
    <div className="flex flex-wrap gap-2">
      {ALLERGENS.map((allergen) => (
        <Chip key={allergen} active={value.includes(allergen)} onClick={() => toggle(allergen)} tone="gold" className="text-xs">
          {t.allergens[allergen]}
        </Chip>
      ))}
    </div>
  );
}
