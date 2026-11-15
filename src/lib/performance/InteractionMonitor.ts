export type InpRating = 'good' | 'needs-improvement' | 'poor';

export interface InteractionRecord {
  interactionId: number;
  name: string;
  target: string;
  inputDelay: number;
  processingDuration: number;
  presentationDelay: number;
  duration: number;
}

export interface InpSnapshot {
  supported: boolean;
  inp: number | null;
  rating: InpRating | null;
  interactions: number;
  longTasks: number;
  last: InteractionRecord | null;
  worst: InteractionRecord | null;
}

interface EventTimingEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  interactionId?: number;
  target?: Node | null;
}

type Listener = () => void;

export class InteractionMonitor {
  public static readonly GOOD_MS = 200;
  public static readonly POOR_MS = 500;

  private readonly interactions = new Map<number, InteractionRecord>();
  private readonly listeners = new Set<Listener>();
  private observers: PerformanceObserver[] = [];
  private longTasks = 0;
  private last: InteractionRecord | null = null;
  private snapshot: InpSnapshot = InteractionMonitor.emptySnapshot(false);
  private started = false;

  public static rate(milliseconds: number): InpRating {
    if (milliseconds <= InteractionMonitor.GOOD_MS) return 'good';
    if (milliseconds <= InteractionMonitor.POOR_MS) return 'needs-improvement';
    return 'poor';
  }

  public start(): void {
    if (this.started || typeof PerformanceObserver === 'undefined') return;
    this.started = true;
    const supported = PerformanceObserver.supportedEntryTypes?.includes('event') ?? false;
    this.snapshot = InteractionMonitor.emptySnapshot(supported);
    if (!supported) return;

    const events = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as EventTimingEntry[]) this.record(entry);
      this.publish();
    });
    events.observe({ type: 'event', buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
    this.observers.push(events);

    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
      const tasks = new PerformanceObserver((list) => {
        this.longTasks += list.getEntries().length;
        this.publish();
      });
      tasks.observe({ type: 'longtask', buffered: true });
      this.observers.push(tasks);
    }
  }

  public reset(): void {
    this.interactions.clear();
    this.spans.clear();
    this.last = null;
    this.longTasks = 0;
    this.publish();
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): InpSnapshot => this.snapshot;

  public getServerSnapshot = (): InpSnapshot => InteractionMonitor.SERVER_SNAPSHOT;

  private static readonly SERVER_SNAPSHOT = InteractionMonitor.emptySnapshot(false);

  private readonly spans = new Map<number, { start: number; processingStart: number; processingEnd: number; end: number; name: string; target: string }>();

  private record(entry: EventTimingEntry): void {
    const interactionId = entry.interactionId ?? 0;
    if (interactionId === 0) return;

    const end = entry.startTime + entry.duration;
    const previous = this.spans.get(interactionId);
    const span = previous
      ? {
          start: Math.min(previous.start, entry.startTime),
          processingStart: Math.min(previous.processingStart, entry.processingStart),
          processingEnd: Math.max(previous.processingEnd, entry.processingEnd),
          end: Math.max(previous.end, end),
          name: entry.processingEnd - entry.processingStart > previous.processingEnd - previous.processingStart ? entry.name : previous.name,
          target: previous.target,
        }
      : {
          start: entry.startTime,
          processingStart: entry.processingStart,
          processingEnd: entry.processingEnd,
          end,
          name: entry.name,
          target: InteractionMonitor.describe(entry.target ?? null),
        };
    this.spans.set(interactionId, span);

    const record: InteractionRecord = {
      interactionId,
      name: span.name,
      target: span.target,
      inputDelay: Math.max(0, span.processingStart - span.start),
      processingDuration: Math.max(0, span.processingEnd - span.processingStart),
      presentationDelay: Math.max(0, span.end - span.processingEnd),
      duration: span.end - span.start,
    };
    this.interactions.set(interactionId, record);
    this.last = record;
  }

  private publish(): void {
    const sorted = [...this.interactions.values()].sort((a, b) => b.duration - a.duration);
    const index = Math.min(sorted.length - 1, Math.floor(sorted.length / 50));
    const candidate = sorted[index] ?? null;
    const inp = candidate ? Math.round(candidate.duration) : null;

    this.snapshot = {
      supported: this.snapshot.supported,
      inp,
      rating: inp === null ? null : InteractionMonitor.rate(inp),
      interactions: sorted.length,
      longTasks: this.longTasks,
      last: this.last,
      worst: candidate,
    };
    for (const listener of this.listeners) listener();
  }

  private static describe(node: Node | null): string {
    if (!(node instanceof Element)) return 'document';
    const label = node.getAttribute('aria-label') ?? node.textContent?.trim().slice(0, 32) ?? '';
    return `${node.tagName.toLowerCase()}${label ? ` "${label}"` : ''}`;
  }

  private static emptySnapshot(supported: boolean): InpSnapshot {
    return { supported, inp: null, rating: null, interactions: 0, longTasks: 0, last: null, worst: null };
  }
}

export const interactionMonitor = new InteractionMonitor();
