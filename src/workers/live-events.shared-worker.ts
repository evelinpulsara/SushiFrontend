type Status = 'connecting' | 'open' | 'reconnecting';

interface SharedWorkerScope {
  onconnect: ((event: MessageEvent) => void) | null;
}

const EVENT_NAMES = ['tables.updated', 'waitlist.updated', 'reservations.updated', 'kpis.updated'] as const;
const scope = self as unknown as SharedWorkerScope;
const ports = new Set<MessagePort>();
let source: EventSource | null = null;
let connectionStatus: Status = 'connecting';

function broadcast(message: unknown): void {
  for (const port of ports) port.postMessage(message);
}

function setStatus(next: Status): void {
  connectionStatus = next;
  broadcast({ type: 'status', status: connectionStatus });
}

function ensureSource(url: string): void {
  if (source) return;
  source = new EventSource(url);
  setStatus('connecting');
  source.onopen = () => setStatus('open');
  source.onerror = () => setStatus('reconnecting');
  for (const name of EVENT_NAMES) {
    source.addEventListener(name, (message) => broadcast({ type: 'event', data: (message as MessageEvent<string>).data }));
  }
}

function release(port: MessagePort): void {
  ports.delete(port);
  broadcast({ type: 'connections', count: ports.size });
  if (ports.size === 0) {
    source?.close();
    source = null;
  }
}

scope.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  if (!port) return;
  ports.add(port);

  port.onmessage = (message: MessageEvent<{ type: string; url?: string }>) => {
    if (message.data.type === 'subscribe' && message.data.url) {
      ensureSource(message.data.url);
      port.postMessage({ type: 'status', status: connectionStatus });
      broadcast({ type: 'connections', count: ports.size });
    } else if (message.data.type === 'unsubscribe') {
      release(port);
    }
  };
  port.start();
};

export {};
