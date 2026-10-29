'use client';

import { CalendarDays, ChefHat, Clock, Search, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import type { Allergen, CreatedReservation, LocalSlot, RestaurantInfo, SlotAvailability } from '@/domain/models';
import { WaitEstimateCard } from '@/components/ai/WaitEstimateCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { AllergenPicker, Chip, Field, Stepper, TextArea, TextInput } from '@/components/ui/Fields';
import { LoadingBlock, Spinner } from '@/components/ui/Spinner';
import { Badge, Card, Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { toApiError, useResource } from '@/hooks/useResource';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { ReservationManager } from '@/lib/services/ReservationManager';
import { services } from '@/lib/services/ServiceRegistry';

const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;
const BOOKING_WINDOW_DAYS = 21;

type SlotState = SlotAvailability | 'past' | 'unknown';

function SlotChip({ label, active, status, onClick }: { label: string; active: boolean; status: SlotState; onClick: () => void }) {
  const { t, fill } = useI18n();
  const isPast = status === 'past';
  const tone =
    status === 'past' || status === 'unknown'
      ? active
        ? 'border-torii/70 bg-torii/15 text-ivory'
        : 'border-line-strong bg-ink-soft text-mist hover:border-mist/50 hover:text-ivory'
      : status.isBookable
        ? active
          ? 'border-matcha bg-matcha/25 text-ivory ring-2 ring-matcha/40'
          : 'border-matcha/50 bg-matcha/10 text-matcha hover:bg-matcha/20'
        : active
          ? 'border-torii bg-torii/25 text-ivory ring-2 ring-torii/40'
          : 'border-torii/50 bg-torii/10 text-torii/90 line-through decoration-torii/50 hover:bg-torii/20';
  const title =
    typeof status === 'object'
      ? status.isBookable
        ? fill(t.reservation.slotOptions, { time: label, count: status.options })
        : fill(t.reservation.slotNoOptions, { time: label })
      : undefined;

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={isPast}
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm tabular-nums transition-all disabled:cursor-not-allowed disabled:opacity-30 ${tone}`}
    >
      {label}
    </button>
  );
}

function Step({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section className="relative border-l border-line pb-10 pl-8 last:pb-0">
      <span className="absolute -left-3.5 top-0 grid size-7 place-items-center rounded-full border border-torii/50 bg-ink font-display text-xs font-bold text-torii">
        {index}
      </span>
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Confirmation({ result, onReset }: { result: CreatedReservation; onReset: () => void }) {
  const { t, fill, format } = useI18n();
  const { zoneName } = useRestaurantInfo();
  const { reservation, assignment } = result;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <Card className="animate-rise overflow-hidden">
        <div className="bg-washi relative p-8 text-center sm:p-12">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-matcha/40 bg-matcha/10 font-display text-2xl text-matcha">
            予
          </span>
          <p className="mt-5 text-xs tracking-[0.3em] text-torii uppercase">{t.reservation.confirmedEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            {fill(t.reservation.confirmedTitle, { name: reservation.guestName.split(' ')[0] ?? reservation.guestName })}
          </h2>
          <p className="mt-2 text-mist">{t.reservation.confirmedText}</p>

          <div className="mx-auto mt-8 inline-flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gold/40 bg-ink/60 px-8 py-5">
            <span className="text-xs tracking-[0.3em] text-smoke uppercase">{t.reservation.codeLabel}</span>
            <span className="font-display text-4xl font-bold tracking-widest text-gold">{reservation.reservationCode}</span>
            <CopyButton value={reservation.reservationCode} />
          </div>

          <dl className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-ink/40 p-4">
              <dt className="text-xs text-smoke">{t.reservation.when}</dt>
              <dd className="mt-1 text-sm font-medium">
                {format.longDate(reservation.reservedAt)} · {format.clock(reservation.reservedAt)}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-ink/40 p-4">
              <dt className="text-xs text-smoke">{t.reservation.partyOf}</dt>
              <dd className="mt-1 text-sm font-medium">{fill(t.common.guestsCount, { count: reservation.partySize })}</dd>
            </div>
            <div className="rounded-xl border border-line bg-ink/40 p-4">
              <dt className="text-xs text-smoke">{t.reservation.assignedTables}</dt>
              <dd className="mt-1 text-sm font-medium">{reservation.tables.map((table) => table.code).join(' + ')}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <div className="mt-6">
        <WaitEstimateCard estimate={assignment} zoneName={zoneName} compact mode="assignment" />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href={`/reservations/${reservation.reservationCode}`} variant="secondary">
          {t.reservation.viewReservation}
        </ButtonLink>
        <ButtonLink href={`/concierge?reservation=${reservation.reservationCode}`} variant="gold" icon={<ChefHat className="size-4" />}>
          {t.reservation.askItamae}
        </ButtonLink>
