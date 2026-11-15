export interface ForecastTable {
  capacity: number;
  minCapacity: number;
  minutesUntilFree: number;
}

export interface ForecastRequest {
  type: 'run';
  tables: ForecastTable[];
  queue: number[];
  arrivalsPerHour: number;
  horizonMinutes: number;
  iterations: number;
  diningMeanMinutes: number;
  diningSdMinutes: number;
  turnoverMinutes: number;
  control: SharedArrayBuffer | null;
}

export interface ForecastBucket {
  fromMinute: number;
  p50: number;
  p90: number;
  samples: number;
}

export type ForecastResponse =
  | { type: 'progress'; completed: number }
  | {
      type: 'done';
      buckets: ForecastBucket[];
      probabilityLongWait: number;
      iterations: number;
      cancelled: boolean;
      elapsedMs: number;
    };

const BUCKET_MINUTES = 15;
const LONG_WAIT_MINUTES = 30;

const PARTY_SIZES: ReadonlyArray<[number, number]> = [
  [1, 0.08],
  [2, 0.55],
  [3, 0.68],
  [4, 0.88],
  [5, 0.93],
  [6, 0.97],
  [8, 1],
];

function samplePartySize(): number {
  const roll = Math.random();
  return PARTY_SIZES.find(([, cumulative]) => roll <= cumulative)?.[0] ?? 2;
}

function sampleNormal(mean: number, sd: number): number {
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sampleInterArrival(ratePerMinute: number): number {
  return -Math.log(1 - Math.random()) / ratePerMinute;
}

function percentile(sorted: Float64Array, p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)));
  return sorted[index] ?? 0;
}

function simulate(request: ForecastRequest): ForecastResponse {
  const startedAt = performance.now();
  const control = request.control ? new Int32Array(request.control) : null;
  const bucketCount = Math.ceil(request.horizonMinutes / BUCKET_MINUTES);
  const waits: number[][] = Array.from({ length: bucketCount }, () => []);
  const ratePerMinute = request.arrivalsPerHour / 60;
  let longWaits = 0;
  let parties = 0;
  let completed = 0;
  let cancelled = false;

  for (let iteration = 0; iteration < request.iterations; iteration += 1) {
    const freeAt = request.tables.map((table) => table.minutesUntilFree);

    const arrivals: Array<{ at: number; size: number }> = request.queue.map((size) => ({ at: 0, size }));
    for (let t = sampleInterArrival(ratePerMinute); t < request.horizonMinutes; t += sampleInterArrival(ratePerMinute)) {
      arrivals.push({ at: t, size: samplePartySize() });
    }

    for (const party of arrivals) {
      let best = -1;
      for (let index = 0; index < request.tables.length; index += 1) {
        const table = request.tables[index]!;
        if (table.capacity < party.size || table.minCapacity > party.size) continue;
        if (best === -1 || freeAt[index]! < freeAt[best]! || (freeAt[index] === freeAt[best] && table.capacity < request.tables[best]!.capacity)) {
          best = index;
        }
      }
      if (best === -1) continue;

      const start = Math.max(party.at, freeAt[best]!);
      const wait = start - party.at;
      freeAt[best] = start + Math.max(45, sampleNormal(request.diningMeanMinutes, request.diningSdMinutes)) + request.turnoverMinutes;

      const bucket = Math.min(bucketCount - 1, Math.floor(party.at / BUCKET_MINUTES));
      waits[bucket]!.push(wait);
      parties += 1;
      if (wait > LONG_WAIT_MINUTES) longWaits += 1;
    }

    completed += 1;
    if (completed % 100 === 0) {
      if (control) {
        Atomics.store(control, 0, completed);
        if (Atomics.load(control, 1) === 1) {
          cancelled = true;
          break;
        }
      } else if (completed % 1000 === 0) {
        postMessage({ type: 'progress', completed } satisfies ForecastResponse);
      }
    }
  }
  if (control) Atomics.store(control, 0, completed);

  const buckets: ForecastBucket[] = waits.map((values, index) => {
    const sorted = Float64Array.from(values).sort();
    return {
      fromMinute: index * BUCKET_MINUTES,
      p50: Math.round(percentile(sorted, 0.5)),
      p90: Math.round(percentile(sorted, 0.9)),
      samples: values.length,
    };
  });

  return {
    type: 'done',
    buckets,
    probabilityLongWait: parties === 0 ? 0 : longWaits / parties,
    iterations: completed,
    cancelled,
    elapsedMs: Math.round(performance.now() - startedAt),
  };
}

self.onmessage = (event: MessageEvent<ForecastRequest>) => {
  if (event.data.type === 'run') {
    postMessage(simulate(event.data));
  }
};
