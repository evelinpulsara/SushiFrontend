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
    startTransition(() => setSelectedId(tableId));
  };

  const data = overview.data;
  const selected = data?.tables.find((table) => table.id === selectedId) ?? null;
  const othersByTable = new Map(
    presence.peers.filter((peer) => peer.tableId && peer.clientId !== presence.clientId).map((peer) => [peer.tableId!, peer.hostName]),
  );

  return (
    <>
      <PageHeader eyebrow={t.dashboard.eyebrow} title={t.dashboard.title} subtitle={t.dashboard.subtitle} kanji="采">
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
          <span className={`flex items-center gap-1.5 ${live.status === 'open' ? 'text-matcha' : 'text-gold'}`}>
            <span className={`size-2 rounded-full ${live.status === 'open' ? 'animate-pulse-soft bg-matcha' : 'bg-gold'}`} />
            {live.status === 'open' ? t.common.live : t.common.offline}
          </span>
          <span className="text-smoke">
            {live.transport === 'shared-worker' && live.sharedTabs !== null
              ? fill(t.live.sharedTabs, { count: live.sharedTabs })
              : t.live.ownStream}
          </span>
          {data && <span className="text-smoke">{fill(t.common.updatedAt, { time: format.clock(data.generatedAt) })}</span>}
          <Button variant="ghost" size="sm" icon={<RefreshCw className={`size-3.5 ${overview.loading ? 'animate-spin' : ''}`} />} onClick={reload}>
            {t.common.retry}
          </Button>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        {(actionError || success) && (
          <div className="sticky top-20 z-40">
            {actionError ? <Notice>{errorText(actionError)}</Notice> : <Notice tone="success">{success}</Notice>}
          </div>
        )}

        <PresenceBar presence={presence} tableCodeOf={(tableId) => data?.tables.find((table) => table.id === tableId)?.code ?? null} />

        {!data && overview.error && (
          <Notice action={<Button size="sm" variant="secondary" onClick={reload}>{t.common.retry}</Button>}>{errorText(overview.error)}</Notice>
        )}
        {!data && !overview.error && <LoadingBlock label={t.common.loading} className="h-96" />}

        {data && (
          <>
            <KpiGrid kpis={data.kpis} />

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <section aria-label={t.dashboard.floorPlan}>
                <h2 className="mb-3 font-display text-lg font-semibold">{t.dashboard.floorPlan}</h2>
                <FloorPlan tables={data.tables} selectedId={selectedId} onSelect={(table) => selectTable(table.id)} handledBy={othersByTable} />
              </section>
              <div className="space-y-3 xl:pt-10">
                {selected && othersByTable.has(selected.id) && (
                  <Notice tone="info">{fill(t.presence.handling, { name: othersByTable.get(selected.id)! })}</Notice>
                )}
                <TableDetailPanel table={selected} actions={actions} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <WaitlistPanel entries={data.waitlist} tables={data.tables} actions={actions} />
              <div className="space-y-6">
                <UpcomingPanel reservations={data.upcomingReservations} actions={actions} />
                <ForecastCard tables={data.tables} queue={data.waitlist} />
                <AccuracyCard accuracy={accuracy.data} />
              </div>
            </div>
          </>
        )}
      </div>
      <PerformanceHud />
    </>
  );
}
