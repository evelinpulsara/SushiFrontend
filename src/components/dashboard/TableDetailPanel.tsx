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

