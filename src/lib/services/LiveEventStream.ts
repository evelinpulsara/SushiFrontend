import type { LiveEvent } from '@/domain/models';
import { liveEventSchema, sharedWorkerMessageSchema } from '@/lib/realtime/schemas';

const EVENT_NAMES = ['tables.updated', 'waitlist.updated', 'reservations.updated', 'kpis.updated'] as const;

export type StreamStatus = 'connecting' | 'open' | 'reconnecting';
export type TransportKind = 'shared-worker' | 'event-source';

export interface StreamCallbacks {
  onEvent: (event: LiveEvent) => void;
  onStatus?: (status: StreamStatus) => void;
  onConnections?: (count: number) => void;
}

interface LiveTransport {
  readonly kind: TransportKind;
  open(): void;
  close(): void;
}

class EventSourceTransport implements LiveTransport {
  public readonly kind = 'event-source' as const;
  private source: EventSource | null = null;

  public constructor(
    private readonly url: string,
    private readonly callbacks: StreamCallbacks,
    private readonly parse: (raw: string) => void,
  ) {}

  public open(): void {
    this.callbacks.onStatus?.('connecting');
    const source = new EventSource(this.url);
    source.onopen = () => this.callbacks.onStatus?.('open');
    source.onerror = () => this.callbacks.onStatus?.('reconnecting');
    for (const name of EVENT_NAMES) {
      source.addEventListener(name, (message) => this.parse((message as MessageEvent<string>).data));
    }
    this.source = source;
  }

  public close(): void {
    this.source?.close();
    this.source = null;
  }
}

class SharedWorkerTransport implements LiveTransport {
  public readonly kind = 'shared-worker' as const;
  private worker: SharedWorker | null = null;
  private readonly onPageHide = () => this.close();

  public constructor(
    private readonly url: string,
    private readonly callbacks: StreamCallbacks,
    private readonly parse: (raw: string) => void,
  ) {}

  public open(): void {
    const worker = new SharedWorker(new URL('../../workers/live-events.shared-worker.ts', import.meta.url), {
      type: 'module',
      name: 'restotime-live-events',
    });
    worker.port.onmessage = (message: MessageEvent) => {
      const parsed = sharedWorkerMessageSchema.safeParse(message.data);
      if (!parsed.success) return;
      const data = parsed.data;
      if (data.type === 'event') this.parse(data.data);
      else if (data.type === 'status') this.callbacks.onStatus?.(data.status);
      else this.callbacks.onConnections?.(data.count);
    };
    worker.port.start();
    worker.port.postMessage({ type: 'subscribe', url: this.url });
    window.addEventListener('pagehide', this.onPageHide);
    this.worker = worker;
  }

  public close(): void {
    window.removeEventListener('pagehide', this.onPageHide);
    this.worker?.port.postMessage({ type: 'unsubscribe' });
    this.worker?.port.close();
    this.worker = null;
  }
}

export class LiveEventStream {
  private transport: LiveTransport | null = null;
  private pending: LiveEvent[] = [];
  private flushScheduled = false;

  public constructor(
    private readonly url: string,
    private readonly callbacks: StreamCallbacks,
  ) {}

  public get transportKind(): TransportKind | null {
    return this.transport?.kind ?? null;
  }

  public connect(): void {
    if (this.transport || typeof window === 'undefined') return;
    const parse = (raw: string) => this.receive(raw);
    try {
      this.transport =
        typeof SharedWorker !== 'undefined'
          ? new SharedWorkerTransport(this.url, this.callbacks, parse)
          : new EventSourceTransport(this.url, this.callbacks, parse);
      this.transport.open();
    } catch {
      this.transport = new EventSourceTransport(this.url, this.callbacks, parse);
      this.transport.open();
    }
  }

  public close(): void {
    this.transport?.close();
    this.transport = null;
  }

  private receive(raw: string): void {
    try {
      const parsed = liveEventSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) return;
      this.pending.push(parsed.data);
    } catch {
      return;
    }
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    queueMicrotask(() => {
      this.flushScheduled = false;
      const batch = this.pending.splice(0);
      for (const event of batch) this.callbacks.onEvent(event);
    });
  }
}
