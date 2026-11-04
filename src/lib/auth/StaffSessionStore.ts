import { z } from 'zod';
import { STAFF_ROLES, type StaffMember, type StaffRole, type StaffSession } from '@/domain/models';

type Listener = () => void;

export interface StaffSnapshot {
  status: 'unknown' | 'signed-out' | 'signed-in';
  staff: StaffMember | null;
  expired: boolean;
}

const storedSessionSchema = z.object({
  token: z.string().min(20),
  expiresAt: z.iso.datetime({ offset: true }),
  staff: z.object({
    id: z.string(),
    email: z.string(),
    displayName: z.string(),
    role: z.enum(STAFF_ROLES),
  }),
});

export class StaffSessionStore {
  private static readonly STORAGE_KEY = 'restotime.staffSession';
  private static readonly SERVER_SNAPSHOT: StaffSnapshot = { status: 'unknown', staff: null, expired: false };

  private session: StaffSession | null = null;
  private snapshot: StaffSnapshot = StaffSessionStore.SERVER_SNAPSHOT;
  private restored = false;
  private expiryTimer: number | null = null;
  private readonly listeners = new Set<Listener>();

  public get token(): string | null {
    if (!this.session) return null;
    if (Date.parse(this.session.expiresAt) <= Date.now()) {
      this.expire();
      return null;
    }
    return this.session.token;
  }

  public get staff(): StaffMember | null {
    return this.session?.staff ?? null;
  }

  public can(...roles: StaffRole[]): boolean {
    const staff = this.staff;
    return staff !== null && (roles.length === 0 || roles.includes(staff.role));
  }

  public signIn(session: StaffSession): void {
    this.update(storedSessionSchema.parse(session), false);
    try {
      window.localStorage.setItem(StaffSessionStore.STORAGE_KEY, JSON.stringify(session));
    } catch {
    }
  }

  public signOut(): void {
    this.update(null, false);
    this.forget();
  }

  public expire(): void {
    if (!this.session) return;
    this.update(null, true);
    this.forget();
  }

  public restore(): void {
    if (this.restored || typeof window === 'undefined') return;
    this.restored = true;
    window.addEventListener('storage', (event) => {
      if (event.key === StaffSessionStore.STORAGE_KEY) this.update(this.read(), false);
    });
    this.update(this.read(), false);
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): StaffSnapshot => this.snapshot;

  public getServerSnapshot = (): StaffSnapshot => StaffSessionStore.SERVER_SNAPSHOT;

  private read(): StaffSession | null {
    try {
      const raw = window.localStorage.getItem(StaffSessionStore.STORAGE_KEY);
      if (!raw) return null;
      const parsed = storedSessionSchema.safeParse(JSON.parse(raw));
      if (!parsed.success || Date.parse(parsed.data.expiresAt) <= Date.now()) return null;
      return parsed.data;
    } catch {
      return null;
    }
  }

  private forget(): void {
    try {
      window.localStorage.removeItem(StaffSessionStore.STORAGE_KEY);
    } catch {
    }
  }

  private update(session: StaffSession | null, expired: boolean): void {
    this.session = session;
    if (this.expiryTimer !== null) window.clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    if (session) {
      const remaining = Math.min(Date.parse(session.expiresAt) - Date.now(), 2_147_000_000);
      this.expiryTimer = window.setTimeout(() => this.expire(), Math.max(0, remaining));
    }
    this.snapshot = { status: session ? 'signed-in' : 'signed-out', staff: session?.staff ?? null, expired };
    for (const listener of this.listeners) listener();
  }
}

export const staffSession = new StaffSessionStore();
