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
