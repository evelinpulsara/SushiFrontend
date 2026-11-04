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
