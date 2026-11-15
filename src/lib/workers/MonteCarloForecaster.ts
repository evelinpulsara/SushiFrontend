import type { DiningTable, WaitlistEntry } from '@/domain/models';
import type { ForecastBucket, ForecastRequest, ForecastResponse, ForecastTable } from '@/workers/forecast.worker';

export interface ForecastResult {
  buckets: ForecastBucket[];
  probabilityLongWait: number;
  iterations: number;
  cancelled: boolean;
  elapsedMs: number;
  usedSharedMemory: boolean;
}

export interface ForecastOptions {
  arrivalsPerHour: number;
  iterations: number;
  horizonMinutes?: number;
}

export class MonteCarloForecaster {
  private worker: Worker | null = null;
  private control: Int32Array | null = null;
  private frame = 0;

  public static get supportsSharedMemory(): boolean {
    return typeof window !== 'undefined' && window.crossOriginIsolated === true && typeof SharedArrayBuffer !== 'undefined';
  }

  public run(
    tables: readonly DiningTable[],
    queue: readonly WaitlistEntry[],
    options: ForecastOptions,
    onProgress: (completed: number, total: number) => void,
  ): Promise<ForecastResult> {
    this.cancel();
    const usedSharedMemory = MonteCarloForecaster.supportsSharedMemory;
    const buffer = usedSharedMemory ? new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT) : null;
    this.control = buffer ? new Int32Array(buffer) : null;

    const worker = new Worker(new URL('../../workers/forecast.worker.ts', import.meta.url), { type: 'module' });
    this.worker = worker;

    const request: ForecastRequest = {
      type: 'run',
      tables: tables.filter((table) => table.isActive).map((table) => MonteCarloForecaster.toForecastTable(table)),
      queue: queue.map((entry) => entry.partySize),
      arrivalsPerHour: options.arrivalsPerHour,
      horizonMinutes: options.horizonMinutes ?? 120,
      iterations: options.iterations,
      diningMeanMinutes: 90,
      diningSdMinutes: 20,
      turnoverMinutes: 10,
      control: buffer,
    };

    if (this.control) {
      const control = this.control;
      const poll = () => {
        onProgress(Atomics.load(control, 0), options.iterations);
        this.frame = requestAnimationFrame(poll);
      };
      this.frame = requestAnimationFrame(poll);
    }

    return new Promise((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<ForecastResponse>) => {
        const data = event.data;
        if (data.type === 'progress') {
          onProgress(data.completed, options.iterations);
          return;
        }
        onProgress(data.iterations, options.iterations);
        this.dispose();
        resolve({ ...data, usedSharedMemory });
      };
      worker.onerror = (error) => {
        this.dispose();
        reject(new Error(error.message));
      };
      worker.postMessage(request);
    });
  }

  public cancel(): void {
    if (this.control) {
      Atomics.store(this.control, 1, 1);
    } else {
      this.dispose();
    }
  }

  private dispose(): void {
    cancelAnimationFrame(this.frame);
    this.worker?.terminate();
    this.worker = null;
    this.control = null;
  }

  private static toForecastTable(table: DiningTable): ForecastTable {
    const remaining = table.currentSeating ? Math.max(5, table.currentSeating.minutesRemaining) : 0;
    const clearingSoon = table.status === 'clearing_soon' ? Math.min(remaining, 10) : remaining;
    return { capacity: table.capacity, minCapacity: table.minCapacity, minutesUntilFree: clearingSoon };
  }
}
