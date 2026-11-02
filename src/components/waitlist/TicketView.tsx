'use client';

import { ChefHat, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { WaitEstimate } from '@/domain/models';
import { WaitEstimateCard } from '@/components/ai/WaitEstimateCard';
import { Enso } from '@/components/decor/Decor';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Badge, Card, Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { toApiError, useResource } from '@/hooks/useResource';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';

export function TicketView({ ticketCode }: { ticketCode: string }) {
  const { t, fill, format } = useI18n();
  const errorText = useErrorText();
  const { zoneName } = useRestaurantInfo();
  const ticket = useResource(`ticket:${ticketCode}`, () => services().waitlist.getTicket(ticketCode));
  const [prediction, setPrediction] = useState<WaitEstimate | null>(null);
  const [busy, setBusy] = useState<'reestimate' | 'cancel' | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  useLiveEvents((event) => {
    if (event.name === 'waitlist.updated' || event.name === 'tables.updated') ticket.reload();
  });

  const entry = ticket.data;
  const isActive = entry?.status === 'waiting' || entry?.status === 'notified';

  const reestimate = async () => {
    if (!entry) return;
    setBusy('reestimate');
    setActionError(null);
    try {
      const result = await services().waitlist.reEstimate(entry.id);
      ticket.replace(result.entry);
      setPrediction(result.prediction);
    } catch (error) {
      setActionError(toApiError(error));
    } finally {
      setBusy(null);
    }
  };

  const leave = async () => {
    if (!entry || !window.confirm(t.waitlist.cancelConfirm)) return;
    setBusy('cancel');
    setActionError(null);
    try {
      ticket.replace(await services().waitlist.cancelTicket(entry.ticketCode));
    } catch (error) {
      setActionError(toApiError(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader eyebrow={t.waitlist.ticketEyebrow} title={`${t.waitlist.ticketCode} ${ticketCode}`} kanji="番">
        <p className="mt-3 flex items-center gap-2 text-xs text-matcha">
          <span className="animate-pulse-soft size-1.5 rounded-full bg-matcha" />
          {t.waitlist.liveHint}
        </p>
      </PageHeader>

      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        {!entry && ticket.error && (
          <Notice>{ticket.error.code === 'RESOURCE_NOT_FOUND' ? t.waitlist.notFound : errorText(ticket.error)}</Notice>
        )}
        {!entry && !ticket.error && <LoadingBlock label={t.common.loading} className="h-80" />}

        {entry && entry.status === 'seated' && (
          <Notice tone="success">
            <strong className="block font-display text-base">{t.waitlist.seatedTitle}</strong>
            {t.waitlist.seatedText}
          </Notice>
        )}
        {entry && entry.status === 'notified' && (
          <Notice tone="info">
            <strong className="block font-display text-base">{t.waitlist.notifiedTitle}</strong>
            {t.waitlist.notifiedText}
          </Notice>
        )}
        {entry && (entry.status === 'cancelled' || entry.status === 'no_show') && (
          <Notice tone="info">
            <strong className="block font-display text-base">{t.waitlist.cancelledTitle}</strong>
            {t.waitlist.cancelledText}
          </Notice>
        )}

        {entry && (
          <Card className="animate-rise overflow-hidden">
            <div className="grid gap-8 p-8 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="relative mx-auto grid size-48 place-items-center">
                <Enso className="absolute inset-0 size-full text-torii/80" />
                <div className="text-center">
                  {isActive ? (
                    <>
                      <span className="block font-display text-6xl leading-none font-bold">
                        {entry.remainingWaitMinutes ?? entry.estimatedWaitMinutes ?? '—'}
                      </span>
                      <span className="text-xs tracking-[0.25em] text-mist uppercase">min</span>
                    </>
                  ) : (
                    <span className="font-display text-3xl text-gold">{t.statuses.waitlist[entry.status]}</span>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={isActive ? 'gold' : entry.status === 'seated' ? 'matcha' : 'torii'}>{t.statuses.waitlist[entry.status]}</Badge>
                  <Badge>{entry.partySize === 1 ? t.common.guestOne : fill(t.common.guestsCount, { count: entry.partySize })}</Badge>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-smoke">{t.waitlist.position}</dt>
                    <dd className="font-display text-3xl font-bold text-ivory">{entry.queuePosition ? `#${entry.queuePosition}` : '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-smoke">{t.waitlist.waited}</dt>
                    <dd className="font-display text-3xl font-bold text-ivory">{fill(t.common.minutesShort, { count: entry.minutesWaiting })}</dd>
