'use client';

import { Armchair, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { AIAccuracy, DiningTable, Reservation, WaitlistEntry } from '@/domain/models';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Fields';
import { Badge, Card } from '@/components/ui/Surface';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';
import type { PanelActions } from './TableDetailPanel';

function PanelTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-5 py-4">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <span className="grid size-7 place-items-center rounded-full bg-surface-raised text-xs font-semibold text-mist">{count}</span>
    </div>
  );
}

function WaitlistRow({ entry, freeTables, actions }: { entry: WaitlistEntry; freeTables: DiningTable[]; actions: PanelActions }) {
  const { t, fill } = useI18n();
  const waitlist = services().waitlist;
  const [choosing, setChoosing] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  const quote = entry.estimatedWaitMinutes;
  const progress = quote ? Math.min(100, (entry.minutesWaiting / Math.max(quote, 1)) * 100) : 0;
  const overdue = quote !== null && entry.minutesWaiting > quote;
  const chosenCapacity = freeTables.filter((table) => chosen.includes(table.id)).reduce((sum, table) => sum + table.capacity, 0);

  const toggle = (id: string) => setChosen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-2)));

  return (
    <li className="space-y-3 px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong font-display text-sm font-bold">
          {entry.queuePosition ?? '·'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{entry.guestName}</span>
            <Badge tone="gold">{entry.ticketCode}</Badge>
            <Badge>{fill(t.common.guestsCount, { count: entry.partySize })}</Badge>
            {entry.status === 'notified' && <Badge tone="aiiro">{t.statuses.waitlist.notified}</Badge>}
          </div>
          <p className={`mt-1 text-xs ${overdue ? 'text-torii' : 'text-mist'}`}>
            {fill(t.dashboard.waitingFor, { minutes: entry.minutesWaiting })}
            {quote !== null && ` · ${fill(t.dashboard.quoted, { minutes: quote })}`}
            {entry.dietaryRestrictions.length > 0 && ` · ${entry.dietaryRestrictions.map((item) => t.allergens[item]).join(', ')}`}
          </p>
          {quote !== null && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className={`h-full rounded-full ${overdue ? 'bg-torii' : 'bg-matcha'}`} style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pl-12">
        <Button size="sm" icon={<Armchair className="size-3.5" />} onClick={() => setChoosing((value) => !value)}>
          {t.dashboard.actions.seat}
        </Button>
        {entry.status === 'waiting' && (
          <Button size="sm" variant="secondary" icon={<Bell className="size-3.5" />} onClick={() => void actions.run(() => waitlist.updateStatus(entry.id, 'notified'), t.dashboard.success.updated)}>
            {t.dashboard.actions.notify}
          </Button>
        )}
        <Button size="sm" variant="ghost" icon={<RefreshCw className="size-3.5" />} onClick={() => void actions.run(() => waitlist.reEstimate(entry.id), t.dashboard.success.updated)}>
          {t.dashboard.actions.reestimate}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => void actions.run(() => waitlist.updateStatus(entry.id, 'no_show'), t.dashboard.success.updated)}>
          {t.dashboard.actions.noShow}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => void actions.run(() => waitlist.updateStatus(entry.id, 'cancelled'), t.dashboard.success.updated)}>
          {t.dashboard.actions.cancel}
        </Button>
      </div>

      {choosing && (
        <div className="ml-12 rounded-xl border border-line bg-ink-soft p-3">
          <p className="mb-2 text-xs text-smoke">{t.dashboard.actions.chooseTables}</p>
          <div className="flex flex-wrap gap-2">
            {freeTables.map((table) => (
              <Chip key={table.id} active={chosen.includes(table.id)} onClick={() => toggle(table.id)} className="text-xs">
                {table.code} · {table.capacity}
              </Chip>
            ))}
          </div>
          <Button
            size="sm"
            className="mt-3"
            disabled={chosen.length === 0 || chosenCapacity < entry.partySize}
