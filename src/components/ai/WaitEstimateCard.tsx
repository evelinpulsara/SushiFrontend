'use client';

import { Bot, Sparkles } from 'lucide-react';
import type { PredictedTable, WaitEstimate } from '@/domain/models';
import { Badge, Card } from '@/components/ui/Surface';
import { useI18n } from '@/lib/i18n/LanguageProvider';

function WaitRing({ minutes, label }: { minutes: number; label?: string }) {
  const { t } = useI18n();
  const ready = minutes === 0;
  const ratio = ready ? 1 : Math.max(0.08, 1 - Math.min(minutes, 90) / 90);
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="relative grid size-36 shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-line" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className={`transition-[stroke-dashoffset] duration-1000 ${label ? 'text-gold' : ready ? 'text-matcha' : 'text-torii'}`}
        />
      </svg>
      <div className="text-center">
        {label ? (
          <span className="font-display text-3xl font-bold text-gold">{label}</span>
        ) : ready ? (
          <span className="font-display text-2xl font-bold text-matcha">{t.common.now}</span>
        ) : (
          <>
            <span className="block font-display text-5xl leading-none font-bold text-ivory">{minutes}</span>
            <span className="text-xs tracking-widest text-mist uppercase">min</span>
          </>
        )}
      </div>
    </div>
  );
}

function TableChips({ tables, zoneName }: { tables: PredictedTable[]; zoneName: (code: string) => string }) {
  const { t } = useI18n();
  if (tables.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tables.map((table, index) => (
        <span key={table.id} className="flex items-center gap-2">
          {index > 0 && <span className="text-xs text-smoke">+</span>}
          <span className="rounded-lg border border-gold/40 bg-gold/10 px-2.5 py-1 font-display text-sm font-bold text-gold">{table.code}</span>
        </span>
      ))}
      <span className="text-xs text-mist">
        {zoneName(tables[0]!.zoneCode)}
        {tables.length > 1 ? ` · ${t.ai.merged}` : ''}
      </span>
    </div>
  );
}

export function WaitEstimateCard({
  estimate,
  zoneName,
  compact = false,
  mode = 'wait',
}: {
  estimate: WaitEstimate;
  zoneName: (code: string) => string;
  compact?: boolean;
  mode?: 'wait' | 'assignment';
}) {
  const { t, fill } = useI18n();
  const confidence = Math.round(estimate.confidence * 100);

  return (
    <Card className="animate-rise overflow-hidden">
      <div className="bg-washi flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <WaitRing
          minutes={estimate.estimatedWaitMinutes}
          label={mode === 'assignment' ? estimate.tables.map((table) => table.code).join('+') : undefined}
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs tracking-[0.2em] text-mist uppercase">
              {mode === 'assignment' ? t.ai.assignmentTitle : estimate.estimatedWaitMinutes === 0 ? t.ai.readyNow : t.ai.waitLabel}
            </span>
            <Badge tone={estimate.strategy === 'wait_for_table' ? 'torii' : estimate.strategy === 'alternative_zone' ? 'aiiro' : 'matcha'}>
              {t.strategies[estimate.strategy]}
            </Badge>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-smoke">{t.ai.tablesSuggested}</p>
            <TableChips tables={estimate.tables} zoneName={zoneName} />
          </div>
          <p className="text-sm leading-relaxed text-ivory/90">
            <Sparkles className="mr-1.5 inline size-3.5 -translate-y-px text-gold" aria-hidden="true" />
            {estimate.reasoning}
          </p>
        </div>
      </div>

      {!compact && estimate.alternatives.length > 0 && (
        <div className="border-t border-line px-6 py-4">
          <p className="mb-2 text-xs tracking-[0.2em] text-mist uppercase">{t.ai.alternatives}</p>
          <ul className="space-y-2">
            {estimate.alternatives.map((alternative) => (
              <li key={alternative.tables.map((table) => table.id).join('-')} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 shrink-0 rounded-md bg-surface-raised px-2 py-0.5 font-display text-xs font-bold text-ivory">
                  {alternative.tables.map((table) => table.code).join(' + ')}
                </span>
                <span className="text-mist">{alternative.note}</span>
                <span className="ml-auto shrink-0 text-xs text-smoke">
                  {alternative.estimatedWaitMinutes === 0 ? t.common.now : fill(t.common.minutesShort, { count: alternative.estimatedWaitMinutes })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-line bg-ink-soft/60 px-6 py-3 text-xs text-smoke">
        <span className="flex items-center gap-1.5">
          <Bot className="size-3.5 text-torii" aria-hidden="true" />
          {t.ai.engine}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-16 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-gold" style={{ width: `${confidence}%` }} />
          </span>
          {fill(t.ai.confidence, { value: confidence })}
        </span>
        {estimate.isFallback ? (
          <span title={t.ai.fallbackHint}>
            <Badge tone="aiiro">{t.ai.fallback}</Badge>
          </span>
        ) : (
          <span className="ml-auto">{fill(t.ai.poweredBy, { model: estimate.model })}</span>
        )}
      </div>
    </Card>
  );
}
