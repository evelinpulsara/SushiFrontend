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
