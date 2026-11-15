'use client';

import { Activity, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useInteractionMetrics } from '@/hooks/useInteractionMetrics';
import { interactionMonitor, type InpRating, type InteractionRecord } from '@/lib/performance/InteractionMonitor';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const RATING_STYLES: Record<InpRating, string> = {
  good: 'border-matcha/50 bg-matcha/10 text-matcha',
  'needs-improvement': 'border-gold/50 bg-gold/10 text-gold',
  poor: 'border-torii/50 bg-torii/10 text-torii',
};

export function InteractionBreakdown({ record }: { record: InteractionRecord }) {
  const { t } = useI18n();
  const total = Math.max(1, record.inputDelay + record.processingDuration + record.presentationDelay);
  const parts = [
    { label: t.perf.inputDelay, value: record.inputDelay, color: 'bg-aiiro' },
    { label: t.perf.processing, value: record.processingDuration, color: 'bg-torii' },
    { label: t.perf.presentation, value: record.presentationDelay, color: 'bg-gold' },
  ];
  return (
    <div className="space-y-2">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-line">
        {parts.map((part) => (
          <span key={part.label} className={part.color} style={{ width: `${(part.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="grid grid-cols-3 gap-2 text-xs">
        {parts.map((part) => (
          <li key={part.label}>
            <span className="flex items-center gap-1.5 text-smoke">
              <span className={`size-2 rounded-full ${part.color}`} />
              {part.label}
            </span>
            <span className="font-display text-sm text-ivory tabular-nums">{Math.round(part.value)} ms</span>
          </li>
        ))}
      </ul>
      <p className="truncate text-xs text-smoke">
        {record.name} · {record.target}
      </p>
    </div>
  );
}

export function InpPanel() {
  const { t, fill } = useI18n();
  const metrics = useInteractionMetrics();
  const ratingLabel = (rating: InpRating) => (rating === 'good' ? t.perf.good : rating === 'poor' ? t.perf.poor : t.perf.needs);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-smoke uppercase">{t.perf.title}</p>
          <p className="font-display text-4xl font-bold tabular-nums">{metrics.inp === null ? '—' : `${metrics.inp} ms`}</p>
        </div>
        {metrics.rating && (
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${RATING_STYLES[metrics.rating]}`}>{ratingLabel(metrics.rating)}</span>
        )}
      </div>
      {!metrics.supported && <p className="text-xs text-smoke">{t.perf.unsupported}</p>}
      {metrics.supported && !metrics.worst && <p className="text-sm text-mist">{t.perf.waiting}</p>}
      {metrics.worst && (
        <div>
          <p className="mb-2 text-xs text-mist">{t.perf.worst}</p>
          <InteractionBreakdown record={metrics.worst} />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-smoke">
        <span>{fill(t.perf.interactions, { count: metrics.interactions })}</span>
        <span>{fill(t.perf.longTasks, { count: metrics.longTasks })}</span>
        <button type="button" className="text-mist underline-offset-2 hover:text-ivory hover:underline" onClick={() => interactionMonitor.reset()}>
          {t.perf.reset}
        </button>
      </div>
      <p className="text-xs text-smoke">{t.perf.thresholds}</p>
    </div>
  );
}

export function PerformanceHud() {
  const metrics = useInteractionMetrics();
  const [open, setOpen] = useState(false);
  const tone = metrics.rating ? RATING_STYLES[metrics.rating] : 'border-line-strong bg-surface text-mist';

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="animate-rise w-80 rounded-2xl border border-line-strong bg-ink/95 p-4 shadow-2xl backdrop-blur-xl">
          <InpPanel />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-lg backdrop-blur ${tone}`}
      >
        <Activity className="size-3.5" aria-hidden="true" />
        INP {metrics.inp === null ? '—' : `${metrics.inp} ms`}
        <ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
    </div>
  );
}
