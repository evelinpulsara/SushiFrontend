import { serverMessageSchema, type PresencePeer } from './schemas';

export type SocketStatus = 'connecting' | 'open' | 'reconnecting' | 'closed';

export interface CollaborationCallbacks {
  onPresence: (peers: PresencePeer[]) => void;
  onStatus: (status: SocketStatus) => void;
  onWelcome: (clientId: string, instanceId: string) => void;
}

const HEARTBEAT_MS = 25_000;
const MAX_BACKOFF_MS = 30_000;

export class HostCollaborationClient {
  private socket: WebSocket | null = null;
  private heartbeat: number | null = null;
  private reconnectTimer: number | null = null;
  private backoff = 1_000;
  private closedByUser = false;
  private focusedTable: string | null = null;

  public constructor(
    private readonly url: string,
    private readonly tokenOf: () => string | null,
    private readonly callbacks: CollaborationCallbacks,
  ) {}

  public connect(): void {
    this.closedByUser = false;
    this.callbacks.onStatus(this.backoff > 1_000 ? 'reconnecting' : 'connecting');
    const token = this.tokenOf();
    if (!token) {
      this.callbacks.onStatus('closed');
      return;
    }
    const socket = new WebSocket(this.url, ['restotime.v1', `bearer.${token}`]);
    this.socket = socket;

    socket.onopen = () => {
      this.backoff = 1_000;
      this.callbacks.onStatus('open');
      if (this.focusedTable) this.send({ type: 'focus', tableId: this.focusedTable });
      this.heartbeat = window.setInterval(() => this.send({ type: 'ping' }), HEARTBEAT_MS);
    };
    socket.onmessage = (message: MessageEvent<string>) => this.receive(message.data);
    socket.onclose = () => {
      this.stopHeartbeat();
      if (this.closedByUser) {
        this.callbacks.onStatus('closed');
        return;
      }
      this.callbacks.onStatus('reconnecting');
      this.reconnectTimer = window.setTimeout(() => this.connect(), this.backoff);
      this.backoff = Math.min(MAX_BACKOFF_MS, this.backoff * 2);
    };
  }

  public focus(tableId: string | null): void {
    this.focusedTable = tableId;
    this.send({ type: 'focus', tableId });
  }

  public close(): void {
    this.closedByUser = true;
    this.stopHeartbeat();
    if (this.reconnectTimer !== null) window.clearTimeout(this.reconnectTimer);
    this.socket?.close(1000, 'bye');
    this.socket = null;
  }

  private receive(raw: string): void {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    const parsed = serverMessageSchema.safeParse(data);
    if (!parsed.success) return;
    const message = parsed.data;
    if (message.type === 'welcome') {
      this.callbacks.onWelcome(message.clientId, message.instanceId);
      this.callbacks.onPresence(message.peers);
    } else if (message.type === 'presence') {
      this.callbacks.onPresence(message.peers);
    }
  }

  private send(message: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message));
  }

  private stopHeartbeat(): void {
    if (this.heartbeat !== null) window.clearInterval(this.heartbeat);
    this.heartbeat = null;
  }
}
