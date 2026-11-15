import type { Metadata } from 'next';
import { StaffGate } from '@/components/auth/StaffGate';
import { DashboardView } from '@/components/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Panel host · Host dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <StaffGate roles={['admin', 'host']}>
      <DashboardView />
    </StaffGate>
  );
}
