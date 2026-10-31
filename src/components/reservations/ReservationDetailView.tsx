'use client';

import { ArrowLeft, ChefHat } from 'lucide-react';
import type { Reservation } from '@/domain/models';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Badge, Card, Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { toApiError, useResource } from '@/hooks/useResource';
import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';

export function ReservationDetailView({ code, initialReservation = null }: { code: string; initialReservation?: Reservation | null }) {
  const { t, fill, format, pick } = useI18n();
  const errorText = useErrorText();
  const reservation = useResource(`reservation:${code}`, () => services().reservations.findByCode(code), initialReservation);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const data = reservation.data;

  const cancel = async () => {
    if (!data || !window.confirm(t.reservation.cancelConfirm)) return;
    setCancelling(true);
    setActionError(null);
    try {
      reservation.replace(await services().reservations.cancelByCode(data.reservationCode));
    } catch (error) {
      setActionError(toApiError(error));
    } finally {
      setCancelling(false);
    }
  };

  const statusTone = data?.status === 'cancelled' || data?.status === 'no_show' ? 'torii' : data?.status === 'confirmed' ? 'matcha' : 'gold';

  return (
    <>
      <PageHeader eyebrow={t.reservation.eyebrow} title={t.reservation.detailTitle} kanji="約" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {!data && reservation.error && (
          <Notice>{reservation.error.code === 'RESOURCE_NOT_FOUND' ? t.reservation.notFound : errorText(reservation.error)}</Notice>
        )}
        {!data && !reservation.error && <LoadingBlock label={t.common.loading} className="h-72" />}

        {data && (
          <Card className="animate-rise overflow-hidden">
            <div className="bg-washi flex flex-wrap items-center justify-between gap-4 border-b border-line p-6">
              <div>
                <p className="text-xs tracking-[0.3em] text-smoke uppercase">{t.reservation.codeLabel}</p>
                <p className="font-display text-3xl font-bold tracking-widest text-gold">{data.reservationCode}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={statusTone}>{t.statuses.reservation[data.status]}</Badge>
                <CopyButton value={data.reservationCode} />
              </div>
            </div>

            <dl className="grid gap-px bg-line sm:grid-cols-2">
              {[
                { label: t.reservation.nameLabel, value: data.guestName },
                { label: t.reservation.when, value: `${format.longDate(data.reservedAt)} · ${format.clock(data.reservedAt)}` },
                { label: t.reservation.partyOf, value: fill(t.common.guestsCount, { count: data.partySize }) },
                { label: t.reservation.assignedTables, value: data.tables.map((table) => table.code).join(' + ') || '—' },
                { label: t.reservation.zone, value: data.preferredZone ? pick(data.preferredZone, 'name') : t.common.noPreference },
                { label: t.reservation.duration, value: fill(t.common.minutesShort, { count: data.durationMinutes }) },
                {
                  label: t.reservation.restrictions,
                  value: data.dietaryRestrictions.length ? data.dietaryRestrictions.map((item) => t.allergens[item]).join(', ') : '—',
                },
                { label: t.reservation.requests, value: data.specialRequests ?? '—' },
              ].map((row) => (
                <div key={row.label} className="bg-surface p-5">
                  <dt className="text-xs text-smoke">{row.label}</dt>
                  <dd className="mt-1 text-sm text-ivory">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-3 border-t border-line p-6">
              <ButtonLink href="/reservations" variant="ghost" icon={<ArrowLeft className="size-4" />}>
                {t.common.back}
              </ButtonLink>
              {(data.status === 'confirmed' || data.status === 'pending') && (
                <>
                  <ButtonLink href={`/concierge?reservation=${data.reservationCode}`} variant="gold" icon={<ChefHat className="size-4" />}>
                    {t.reservation.askItamae}
                  </ButtonLink>
                  <Button variant="danger" onClick={cancel} loading={cancelling} className="sm:ml-auto">
                    {t.reservation.cancelReservation}
                  </Button>
                </>
              )}
              {data.status === 'cancelled' && <p className="text-sm text-mist sm:ml-auto">{t.reservation.cancelledNotice}</p>}
            </div>
            {actionError && (
              <div className="px-6 pb-6">
                <Notice>{errorText(actionError)}</Notice>
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
