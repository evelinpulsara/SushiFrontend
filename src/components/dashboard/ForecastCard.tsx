'use client';

import { Cpu, Square } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import type { DiningTable, WaitlistEntry } from '@/domain/models';
import { Button } from '@/components/ui/Button';
import { Card, Notice } from '@/components/ui/Surface';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { MonteCarloForecaster, type ForecastResult } from '@/lib/workers/MonteCarloForecaster';

const ITERATIONS = 20_000;

export function ForecastCard({ tables, queue }: { tables: readonly DiningTable[]; queue: readonly WaitlistEntry[] }) {
  const { t, fill } = useI18n();
  const forecaster = useRef<MonteCarloForecaster | null>(null);
  const [arrivals, setArrivals] = useState(8);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => () => forecaster.current?.cancel(), []);

  const run = async () => {
    forecaster.current ??= new MonteCarloForecaster();
    setError(null);
    setProgress(0);
    try {
      const outcome = await forecaster.current.run(tables, queue, { arrivalsPerHour: arrivals, iterations: ITERATIONS }, (completed, total) =>
        setProgress(Math.round((completed / total) * 100)),
      );
      startTransition(() => setResult(outcome));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setProgress(null);
    }
  };

  const maxWait = Math.max(30, ...(result?.buckets.map((bucket) => bucket.p90) ?? [0]));

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
          <Cpu className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">{t.forecast.title}</h2>
          <p className="text-xs text-smoke">{t.forecast.subtitle}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="block text-xs text-mist" htmlFor="arrivals-rate">
          {fill(t.forecast.arrivals, { count: arrivals })}
        </label>
        <input
          id="arrivals-rate"
          type="range"
          min={2}
          max={24}
          value={arrivals}
          onChange={(event) => setArrivals(Number(event.target.value))}
          className="w-full accent-torii"
        />
        <div className="flex flex-wrap items-center gap-3">
          {progress === null ? (
            <Button size="sm" variant="gold" icon={<Cpu className="size-3.5" />} onClick={() => void run()}>
              {fill(t.forecast.run, { count: ITERATIONS.toLocaleString() })}
            </Button>
          ) : (
            <>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-gradient-to-r from-gold to-torii transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-mist tabular-nums">{fill(t.forecast.running, { percent: progress })}</span>
              <Button size="sm" variant="ghost" icon={<Square className="size-3" />} onClick={() => forecaster.current?.cancel()}>
                {t.forecast.cancel}
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Notice>{error}</Notice>
        </div>
      )}

      {result && (
        <div className="mt-5 space-y-4">
          {result.cancelled && <p className="text-xs text-gold">{t.forecast.cancelled}</p>}
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {result.buckets.map((bucket) => (
              <div key={bucket.fromMinute} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11px] text-mist tabular-nums">{bucket.p90}′</span>
                <div className="relative w-full flex-1">
                  <div className="absolute bottom-0 w-full rounded-t-md bg-torii/25" style={{ height: `${(bucket.p90 / maxWait) * 100}%` }} />
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-torii to-gold"
                    style={{ height: `${(bucket.p50 / maxWait) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-smoke">+{bucket.fromMinute}′</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-smoke">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-gradient-to-t from-torii to-gold" />
              {t.forecast.p50}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-torii/25" />
              {t.forecast.p90}
            </span>
          </div>
          <p className="text-sm">
            {t.forecast.longWait}: <span className="font-display text-lg font-bold text-gold">{Math.round(result.probabilityLongWait * 100)}%</span>
          </p>
          <p className="text-xs text-smoke">
            {fill(t.forecast.engine, {
              iterations: result.iterations.toLocaleString(),
              ms: result.elapsedMs,
              transport: result.usedSharedMemory ? t.forecast.shared : t.forecast.message,
            })}
          </p>
        </div>
      )}
    </Card>
  );
}
