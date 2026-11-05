import type { StaffSession } from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';
import type { StaffSessionStore } from '@/lib/auth/StaffSessionStore';

export class StaffAuth {
  public constructor(
    private readonly api: ApiClient,
    private readonly session: StaffSessionStore,
  ) {}

  public async signIn(email: string, password: string): Promise<StaffSession> {
    const session = await this.api.post<StaffSession>('/auth/login', { email, password });
    this.session.signIn(session);
    return session;
  }

  public signOut(): void {
    this.session.signOut();
  }
}
