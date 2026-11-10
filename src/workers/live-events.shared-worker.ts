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
