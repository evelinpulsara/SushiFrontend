import type { StaffRole } from '@/domain/models';

export interface DemoAccount {
  email: string;
  password: string;
  role: StaffRole;
}

export class DemoAccounts {
  private static readonly ACCOUNTS: readonly DemoAccount[] = [
    { email: 'admin@kurenai.demo', password: 'Kurenai2026!', role: 'admin' },
    { email: 'anfitrion@kurenai.demo', password: 'Kurenai2026!', role: 'host' },
  ];

  public static get visible(): readonly DemoAccount[] {
    return process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS === 'false' ? [] : DemoAccounts.ACCOUNTS;
  }
}
