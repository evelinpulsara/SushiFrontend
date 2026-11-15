'use client';

import { RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PerformanceHud } from '@/components/performance/PerformanceHud';
import { Button } from '@/components/ui/Button';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { useHostPresence } from '@/hooks/useHostPresence';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { toApiError, useResource } from '@/hooks/useResource';
import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';
import { FloorPlan } from './FloorPlan';
import { ForecastCard } from './ForecastCard';
import { KpiGrid } from './KpiGrid';
import { PresenceBar } from './PresenceBar';
import { AccuracyCard, UpcomingPanel, WaitlistPanel } from './QueuePanels';
import { TableDetailPanel, type PanelActions } from './TableDetailPanel';

const SAFETY_REFRESH_MS = 60_000;
const EVENT_DEBOUNCE_MS = 400;

export function DashboardView() {
  const { t, fill, format } = useI18n();
  const errorText = useErrorText();
  const overview = useResource('dashboard-overview', () => services().host.getOverview());
  const accuracy = useResource('dashboard-accuracy', () => services().host.getAIAccuracy());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const debounce = useRef<number | null>(null);
  const { reload } = overview;
  const presence = useHostPresence();

  const live = useLiveEvents(() => {
    if (debounce.current !== null) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      reload();
      accuracy.reload();
    }, EVENT_DEBOUNCE_MS);
  });

  useEffect(() => {
    const timer = window.setInterval(reload, SAFETY_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [reload]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(null), 3000);
    return () => window.clearTimeout(timer);
  }, [success]);

  const actions: PanelActions = {
    run: async (action, successMessage) => {
      setActionError(null);
      try {
        await action();
        if (successMessage) setSuccess(successMessage);
        reload();
        return true;
      } catch (error) {
        setActionError(toApiError(error));
        return false;
      }
    },
  };

  const selectTable = (tableId: string) => {
    presence.focus(tableId);
