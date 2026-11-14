'use client';

import { Bot, LogOut, UserPlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { DiningTable, SeatSuggestion } from '@/domain/models';
import { Button } from '@/components/ui/Button';
import { Field, Stepper, TextInput } from '@/components/ui/Fields';
import { Badge, Card, STATUS_TONE } from '@/components/ui/Surface';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';

export interface PanelActions {
  run: (action: () => Promise<unknown>, successMessage: string) => Promise<boolean>;
}

export function TableDetailPanel({ table, actions }: { table: DiningTable | null; actions: PanelActions }) {
  const { t, fill, format, pick } = useI18n();
  const host = services().host;
  const [walkInName, setWalkInName] = useState('');
  const [walkInParty, setWalkInParty] = useState(2);
  const [suggestion, setSuggestion] = useState<SeatSuggestion | null>(null);
  const [suggesting, setSuggesting] = useState(false);

  if (!table) {
    return (
      <Card className="grid min-h-48 place-items-center p-6 text-center text-sm text-mist">
        <p>{t.dashboard.selectTable}</p>
      </Card>
    );
  }

  const seating = table.currentSeating;
  const isFree = table.status === 'available' || table.status === 'reserved';
  const activeSuggestion = suggestion?.focusTableId === table.id ? suggestion : null;

  const askSuggestion = async () => {
    setSuggesting(true);
    const ok = await actions.run(async () => setSuggestion(await services().waitlist.suggestForTable(table.id)), '');
    if (!ok) setSuggestion(null);
    setSuggesting(false);
  };

  const seatWalkIn = async (event: FormEvent) => {
    event.preventDefault();
    if (walkInName.trim().length < 2) return;
    const ok = await actions.run(
      () => host.seatWalkIn({ tableIds: [table.id], guestName: walkInName.trim(), partySize: walkInParty }),
      t.dashboard.success.seated,
    );
    if (ok) setWalkInName('');
  };

  return (
    <Card className="animate-rise overflow-hidden" key={table.id}>
      <div className="bg-washi flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          <p className="font-display text-3xl font-bold">{table.code}</p>
          <p className="text-xs text-mist">
            {t.zonesKanji[table.zone.code]} {pick(table.zone, 'name')} · {fill(t.dashboard.detail.capacity, { min: table.minCapacity, max: table.capacity })}
          </p>
        </div>
        <Badge tone={STATUS_TONE[table.effectiveStatus]}>{t.statuses.table[table.effectiveStatus]}</Badge>
      </div>

      <div className="space-y-6 p-5">
        {seating && (
          <div className="rounded-xl border border-line bg-ink-soft p-4">
            <p className="text-xs text-smoke">{t.dashboard.detail.guest}</p>
            <p className="font-medium">{seating.guestName}</p>
            <p className="mt-1 text-xs text-mist">
              {fill(t.common.guestsCount, { count: seating.partySize })} · {fill(t.dashboard.seatedFor, { minutes: seating.minutesSeated })} ·{' '}
              {seating.minutesRemaining > 0 ? fill(t.dashboard.leavesIn, { minutes: seating.minutesRemaining }) : t.dashboard.overdue}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              icon={<LogOut className="size-3.5" />}
              onClick={() => {
                if (window.confirm(t.dashboard.detail.releaseConfirm)) {
                  void actions.run(() => host.releaseSeating(seating.seatingId), t.dashboard.success.released);
                }
              }}
            >
              {t.dashboard.detail.release}
            </Button>
          </div>
        )}

        {table.nextReservation && (
          <p className="rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-xs text-gold">
            {fill(t.dashboard.nextBooking, { code: table.nextReservation.reservationCode, minutes: Math.max(0, table.nextReservation.minutesUntil) })} ·{' '}
            {table.nextReservation.guestName} ({table.nextReservation.partySize}) · {format.clock(table.nextReservation.reservedAt)}
          </p>
        )}

        {host.allowedTransitions(table).length > 0 && (
          <div>
            <p className="mb-2 text-xs tracking-wide text-smoke uppercase">{t.dashboard.detail.changeStatus}</p>
            <div className="flex flex-wrap gap-2">
              {host.allowedTransitions(table).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant="secondary"
                  onClick={() => void actions.run(() => host.updateTableStatus(table.id, status), t.dashboard.success.updated)}
                >
                  → {t.statuses.table[status]}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-torii/25 bg-torii/5 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Bot className="size-4 text-torii" aria-hidden="true" />
            {t.dashboard.detail.suggestTitle}
          </p>
          {activeSuggestion ? (
            <div className="space-y-3 text-sm">
              <p className="leading-relaxed text-ivory/90">{activeSuggestion.reasoning}</p>
              {activeSuggestion.entry ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="gold">{activeSuggestion.entry.ticketCode}</Badge>
                  <span className="text-xs text-mist">
                    {activeSuggestion.entry.guestName} · {fill(t.common.guestsCount, { count: activeSuggestion.entry.partySize })} →{' '}
                    {activeSuggestion.tables.map((candidate) => candidate.code).join(' + ')}
                  </span>
                  {isFree && (
                    <Button
                      size="sm"
                      className="ml-auto"
                      onClick={() =>
                        void actions
                          .run(
                            () => services().waitlist.seat(activeSuggestion.entry!.id, activeSuggestion.tables.map((candidate) => candidate.id)),
                            t.dashboard.success.seated,
                          )
                          .then((ok) => ok && setSuggestion(null))
                      }
                    >
                      {fill(t.dashboard.detail.suggestSeat, { ticket: activeSuggestion.entry.ticketCode })}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-mist">{t.dashboard.detail.suggestNone}</p>
              )}
              <p className="text-xs text-smoke">{activeSuggestion.isFallback ? t.ai.fallback : fill(t.ai.poweredBy, { model: activeSuggestion.model })}</p>
            </div>
          ) : (
            <Button size="sm" variant="gold" onClick={askSuggestion} loading={suggesting} icon={<Bot className="size-3.5" />}>
              {suggesting ? t.dashboard.detail.suggesting : t.dashboard.detail.suggestButton}
            </Button>
          )}
        </div>

        {isFree && (
          <form onSubmit={seatWalkIn} className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <UserPlus className="size-4 text-matcha" aria-hidden="true" />
              {t.dashboard.detail.walkInTitle}
            </p>
            <Field label={t.dashboard.detail.walkInName} htmlFor="walk-in-name">
              <TextInput id="walk-in-name" value={walkInName} onChange={(event) => setWalkInName(event.target.value)} />
            </Field>
            <div className="flex items-center justify-between gap-3">
              <Stepper value={walkInParty} min={1} max={table.capacity} onChange={setWalkInParty} label={t.dashboard.detail.walkInParty} />
              <Button type="submit" size="sm" disabled={walkInName.trim().length < 2}>
                {t.dashboard.detail.walkInSubmit}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
