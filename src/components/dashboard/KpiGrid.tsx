'use client';

import { Armchair, Bot, CalendarDays, Gauge, Hourglass, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import type { LiveKpis } from '@/domain/models';
import { useI18n } from '@/lib/i18n/LanguageProvider';

interface Kpi {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  meter?: number;
  accent: string;
}

export function KpiGrid({ kpis }: { kpis: LiveKpis }) {
  const { t, fill } = useI18n();
  const items: Kpi[] = [
    { icon: Gauge, label: t.dashboard.kpis.occupancy, value: `${Math.round(kpis.tableOccupancyRate)}%`, meter: kpis.tableOccupancyRate, accent: 'text-torii' },
    {
      icon: Armchair,
      label: t.dashboard.kpis.efficiency,
      value: `${Math.round(kpis.seatEfficiencyRate)}%`,
      hint: t.dashboard.kpis.efficiencyHint,
      meter: kpis.seatEfficiencyRate,
      accent: 'text-gold',
    },
    { icon: UtensilsCrossed, label: t.dashboard.kpis.available, value: `${kpis.availableTables}/${kpis.totalTables}`, accent: 'text-matcha' },
    { icon: Users, label: t.dashboard.kpis.seated, value: `${kpis.seatedGuests}/${kpis.totalSeats}`, accent: 'text-ivory' },
    {
      icon: Hourglass,
      label: t.dashboard.kpis.waiting,
      value: String(kpis.waitingParties),
      hint: fill(t.dashboard.kpis.waitingGuests, { count: kpis.waitingGuests }),
      accent: 'text-aiiro',
    },
    { icon: Hourglass, label: t.dashboard.kpis.avgWait, value: fill(t.common.minutesShort, { count: kpis.avgCurrentWaitMinutes }), accent: 'text-mist' },
    { icon: CalendarDays, label: t.dashboard.kpis.upcoming, value: String(kpis.upcomingReservations2h), accent: 'text-gold' },
    {
      icon: Bot,
      label: t.dashboard.kpis.aiAccuracy,
      value:
        kpis.aiMeanAbsoluteErrorMinutes === null
          ? '—'
          : fill(t.dashboard.kpis.aiAccuracyValue, { value: kpis.aiMeanAbsoluteErrorMinutes }),
      hint: kpis.aiMeanAbsoluteErrorMinutes === null ? t.dashboard.kpis.aiAccuracyEmpty : undefined,
      accent: 'text-torii',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-line bg-surface/80 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-wide text-smoke uppercase">{item.label}</p>
            <item.icon className={`size-4 ${item.accent}`} aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ivory tabular-nums sm:text-3xl">{item.value}</p>
          {item.meter !== undefined && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-gradient-to-r from-torii to-gold transition-all duration-700" style={{ width: `${Math.min(100, item.meter)}%` }} />
            </div>
          )}
          {item.hint && <p className="mt-1.5 text-xs text-smoke">{item.hint}</p>}
        </div>
      ))}
    </div>
  );
}
