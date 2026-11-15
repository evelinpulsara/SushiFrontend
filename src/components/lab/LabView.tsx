'use client';

import { ExternalLink, Zap } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ForecastCard } from '@/components/dashboard/ForecastCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { InpPanel } from '@/components/performance/PerformanceHud';
import { Button } from '@/components/ui/Button';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Badge, Card } from '@/components/ui/Surface';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useResource } from '@/hooks/useResource';
import { useServiceWorkerStatus } from '@/hooks/useServiceWorkerStatus';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { MainThreadScheduler } from '@/lib/performance/MainThreadScheduler';
import { services } from '@/lib/services/ServiceRegistry';
import { MonteCarloForecaster } from '@/lib/workers/MonteCarloForecaster';

function Section({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {text && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mist">{text}</p>}
      </div>
      {children}
    </section>
  );
}

function InpLab() {
  const { t, fill } = useI18n();
  const [result, setResult] = useState<{ mode: 'blocking' | 'yielding'; ms: number } | null>(null);

  const runBlocking = () => {
    const started = performance.now();
    MainThreadScheduler.busyWork(400);
    setResult({ mode: 'blocking', ms: Math.round(performance.now() - started) });
  };

  const runYielding = async () => {
    const started = performance.now();
    await MainThreadScheduler.chunkedWork(400);
    setResult({ mode: 'yielding', ms: Math.round(performance.now() - started) });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <InpPanel />
      </Card>
      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <Button variant="danger" onClick={runBlocking} icon={<Zap className="size-4" />}>
            {t.lab.blocking}
          </Button>
          <p className="text-xs text-smoke">{t.lab.blockingHint}</p>
        </div>
        <div className="space-y-2">
          <Button variant="secondary" onClick={() => void runYielding()} icon={<Zap className="size-4" />}>
            {t.lab.yielding}
          </Button>
          <p className="text-xs text-smoke">{t.lab.yieldingHint}</p>
        </div>
        {result && (
          <p className={`text-sm ${result.mode === 'blocking' ? 'text-torii' : 'text-matcha'}`}>
            {result.mode === 'blocking' ? t.lab.blocking : t.lab.yielding}: {fill(t.lab.workDone, { ms: result.ms })}
          </p>
        )}
      </Card>
    </div>
  );
}

function EventLoopDemo() {
  const { t } = useI18n();
  const [log, setLog] = useState<string[]>([]);

  const run = () => {
    const steps: string[] = [];
    const channel = new MessageChannel();
    channel.port1.onmessage = () => steps.push(t.lab.loopMessage);
    setTimeout(() => steps.push(t.lab.loopTimeout), 0);
    requestAnimationFrame(() => steps.push(t.lab.loopRaf));
    channel.port2.postMessage(null);
    void Promise.resolve().then(() => steps.push(t.lab.loopPromise));
    queueMicrotask(() => steps.push(t.lab.loopMicrotask));
    steps.push(t.lab.loopSync);
    setTimeout(() => {
      channel.port1.close();
      setLog([...steps]);
    }, 120);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{t.lab.loopTitle}</h3>
          <p className="text-xs text-smoke">{t.lab.loopText}</p>
        </div>
        <Button variant="gold" size="sm" onClick={run}>
          {t.lab.loopRun}
        </Button>
      </div>
      {log.length > 0 && (
        <ol className="mt-5 space-y-2">
          {log.map((step, index) => (
            <li key={step} className="animate-rise flex items-center gap-3 text-sm" style={{ animationDelay: `${index * 80}ms` }}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-torii text-xs font-bold">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-xs text-smoke">{t.lab.loopNote}</p>
    </Card>
  );
}

function CompositorDemo() {
  const { t } = useI18n();
  const [blocking, setBlocking] = useState(false);

  const block = () => {
    setBlocking(true);
    setTimeout(() => {
      MainThreadScheduler.busyWork(2000);
      setBlocking(false);
    }, 50);
  };

  return (
    <Card className="space-y-5 p-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {t.lab.pipeline.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span className="rounded-full border border-line-strong bg-ink-soft px-3 py-1">{step}</span>
            {index < t.lab.pipeline.length - 1 && <span className="text-smoke">→</span>}
          </li>
        ))}
      </ol>

      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs text-matcha">{t.lab.compositorLabel}</p>
          <div className="relative h-12 overflow-hidden rounded-xl border border-line bg-ink-soft">
            <div className="animate-slide-compositor h-full w-full will-change-transform">
              <span className="grid h-full w-12 place-items-center rounded-xl bg-matcha font-display font-bold text-ink">紅</span>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-torii">{t.lab.mainLabel}</p>
          <div className="relative h-12 overflow-hidden rounded-xl border border-line bg-ink-soft">
            <span className="animate-slide-layout absolute top-0 grid h-full w-12 place-items-center rounded-xl bg-torii font-display font-bold">紅</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="danger" onClick={block} loading={blocking}>
          {t.lab.compositorBlock}
        </Button>
        <p className="text-xs text-smoke">{t.lab.compositorHint}</p>
      </div>
    </Card>
  );
}

function StatusRow({ label, active, detail }: { label: string; active: boolean; detail?: string }) {
  const { t } = useI18n();
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3 last:border-0">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2">
        {detail && <span className="text-xs text-smoke">{detail}</span>}
        <Badge tone={active ? 'matcha' : 'neutral'}>{active ? t.lab.active : t.lab.inactive}</Badge>
      </span>
    </li>
  );
}

function WorkersLab() {
  const { t, fill } = useI18n();
  const live = useLiveEvents(() => undefined);
  const serviceWorker = useServiceWorkerStatus();
  const overview = useResource('lab-overview', () => services().host.getOverview());
  const [environment] = useState(() =>
    typeof window === 'undefined'
      ? { isolated: false, sab: false }
      : { isolated: window.crossOriginIsolated === true, sab: MonteCarloForecaster.supportsSharedMemory },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <ul>
          <StatusRow label={t.lab.isolated} active={environment.isolated} />
          <StatusRow label={t.lab.sab} active={environment.sab} />
          <StatusRow
            label={t.lab.sharedWorker}
            active={live.transport === 'shared-worker'}
            detail={live.transport === 'shared-worker' && live.sharedTabs !== null ? fill(t.lab.tabs, { count: live.sharedTabs }) : t.lab.ownTransport}
          />
          <StatusRow
            label={t.lab.serviceWorker}
            active={serviceWorker === 'controlling' || serviceWorker === 'registered'}
            detail={serviceWorker === 'controlling' ? t.lab.swControlled : t.lab.swPending}
          />
        </ul>
        <p className="mt-4 text-xs text-smoke">{t.lab.workersTip}</p>
      </Card>
      {overview.data ? (
        <ForecastCard tables={overview.data.tables} queue={overview.data.waitlist} />
      ) : (
        <LoadingBlock label={t.common.loading} className="h-64" />
      )}
    </div>
  );
}

function RenderingTable() {
  const { t } = useI18n();
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs tracking-wide text-smoke uppercase">
            {t.lab.renderingHeaders.map((header) => (
              <th key={header} className="px-5 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.lab.renderingRows.map(([route, pattern, reason]) => (
            <tr key={route} className="border-b border-line last:border-0">
              <td className="px-5 py-3 font-mono text-xs text-gold">{route}</td>
              <td className="px-5 py-3">
                <Badge tone="torii">{pattern}</Badge>
              </td>
              <td className="px-5 py-3 text-mist">{reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function CommunicationList() {
  const { t } = useI18n();
  const docsUrl = services().api.url('/docs');
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.lab.comms.map(([title, text]) => (
          <Card key={title} className="p-5">
            <h3 className="font-display text-base font-semibold text-gold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
          </Card>
        ))}
      </div>
      <a
        href={docsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-gold hover:bg-gold/20"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        {t.lab.openDocs}
      </a>
    </div>
  );
}

export function LabView() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t.lab.eyebrow} title={t.lab.title} subtitle={t.lab.subtitle} kanji="研" />
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <Section title={t.lab.inpTitle} text={t.lab.inpText}>
          <InpLab />
          <EventLoopDemo />
        </Section>
        <Section title={t.lab.compositorTitle} text={t.lab.compositorText}>
          <CompositorDemo />
        </Section>
        <Section title={t.lab.workersTitle}>
          <WorkersLab />
        </Section>
        <Section title={t.lab.renderingTitle}>
          <RenderingTable />
        </Section>
        <Section title={t.lab.commsTitle}>
          <CommunicationList />
        </Section>
      </div>
    </>
  );
}
