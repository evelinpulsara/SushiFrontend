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
