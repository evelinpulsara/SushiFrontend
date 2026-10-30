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
