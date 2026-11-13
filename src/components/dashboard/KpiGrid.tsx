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
