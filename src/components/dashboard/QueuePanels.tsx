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
            onClick={() =>
              void actions.run(() => waitlist.seat(entry.id, chosen), t.dashboard.success.seated).then((ok) => {
                if (ok) {
                  setChoosing(false);
                  setChosen([]);
                }
              })
            }
          >
            {t.dashboard.actions.confirmSeat}
          </Button>
        </div>
      )}
    </li>
  );
}

export function WaitlistPanel({ entries, tables, actions }: { entries: WaitlistEntry[]; tables: DiningTable[]; actions: PanelActions }) {
  const { t } = useI18n();
  const freeTables = services().host.freeTables(tables);
  return (
    <Card className="overflow-hidden">
      <PanelTitle title={t.dashboard.waitlistTitle} count={entries.length} />
      {entries.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-mist">{t.dashboard.emptyQueue}</p>
      ) : (
        <ul className="divide-y divide-line">
          {entries.map((entry) => (
            <WaitlistRow key={entry.id} entry={entry} freeTables={freeTables} actions={actions} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function isToday(iso: string): boolean {
  const zone = 'America/Bogota';
  const day = (date: Date) => date.toLocaleDateString('en-CA', { timeZone: zone });
  return day(new Date(iso)) === day(new Date());
}

export function UpcomingPanel({ reservations, actions }: { reservations: Reservation[]; actions: PanelActions }) {
  const { t, fill, format } = useI18n();
  const manager = services().reservations;
  return (
    <Card className="overflow-hidden">
      <PanelTitle title={t.dashboard.upcomingTitle} count={reservations.length} />
      {reservations.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-mist">{t.dashboard.noUpcoming}</p>
      ) : (
        <ul className="divide-y divide-line">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="w-20 shrink-0">
                <p className="font-display text-lg font-bold text-gold tabular-nums">{format.clock(reservation.reservedAt)}</p>
                {!isToday(reservation.reservedAt) && <p className="text-[11px] text-smoke">{format.longDate(reservation.reservedAt)}</p>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{reservation.guestName}</p>
                  <Badge tone={reservation.status === 'pending' ? 'gold' : 'aiiro'}>{t.statuses.reservation[reservation.status]}</Badge>
                </div>
                <p className="text-xs text-mist">
                  {reservation.reservationCode} · {fill(t.common.guestsCount, { count: reservation.partySize })}
                  {reservation.tables.length > 0 && ` · ${reservation.tables.map((table) => table.code).join(' + ')}`}
                  {reservation.guestPhone && ` · ${reservation.guestPhone}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {reservation.status === 'pending' && (
                  <Button size="sm" variant="secondary" onClick={() => void actions.run(() => manager.updateStatus(reservation.id, 'confirmed'), t.dashboard.success.updated)}>
                    {t.dashboard.actions.confirm}
                  </Button>
                )}
                <Button size="sm" onClick={() => void actions.run(() => manager.seat(reservation.id), t.dashboard.success.seated)}>
                  {t.dashboard.actions.seat}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void actions.run(() => manager.updateStatus(reservation.id, 'no_show'), t.dashboard.success.updated)}>
                  {t.dashboard.actions.noShow}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm(t.dashboard.actions.cancelReservation)) {
                      void actions.run(() => manager.updateStatus(reservation.id, 'cancelled'), t.dashboard.success.updated);
                    }
                  }}
                >
                  {t.dashboard.actions.cancel}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function AccuracyCard({ accuracy }: { accuracy: AIAccuracy | null }) {
  const { t, fill } = useI18n();
  const summary = accuracy?.last7Days;
  return (
    <Card className="p-5">
      <h2 className="font-display text-lg font-semibold">{t.dashboard.accuracyTitle}</h2>
      <p className="mt-1 text-xs text-smoke">{t.dashboard.accuracyText}</p>
      {summary && summary.sampleSize > 0 ? (
        <div className="mt-4 flex items-end gap-6">
          <p className="font-display text-4xl font-bold text-gold">±{summary.meanAbsoluteErrorMinutes}</p>
          <div className="space-y-1 text-xs text-mist">
            {summary.withinFiveMinutesRate !== null && <p>{fill(t.dashboard.accuracyWithin, { value: summary.withinFiveMinutesRate })}</p>}
            <p>{fill(t.dashboard.accuracySamples, { count: summary.sampleSize })}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-mist">{t.dashboard.kpis.aiAccuracyEmpty}</p>
      )}
    </Card>
  );
}
