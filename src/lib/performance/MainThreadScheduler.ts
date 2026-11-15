interface SchedulerWithYield {
  yield?: () => Promise<void>;
}

export class MainThreadScheduler {
  public static yieldToMain(): Promise<void> {
    const scheduler = (globalThis as { scheduler?: SchedulerWithYield }).scheduler;
    if (scheduler?.yield) return scheduler.yield();
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  public static busyWork(milliseconds: number): void {
    const end = performance.now() + milliseconds;
    let accumulator = 0;
    while (performance.now() < end) accumulator += Math.sqrt(Math.random());
    if (accumulator < 0) console.log(accumulator);
  }

  public static async chunkedWork(totalMilliseconds: number, chunkMilliseconds = 40): Promise<void> {
    let remaining = totalMilliseconds;
    while (remaining > 0) {
      await MainThreadScheduler.yieldToMain();
      const slice = Math.min(chunkMilliseconds, remaining);
      MainThreadScheduler.busyWork(slice);
      remaining -= slice;
    }
  }
}
