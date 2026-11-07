import type { Metadata } from 'next';
import { StaffLoginView } from '@/components/auth/StaffLoginView';

export const metadata: Metadata = {
  title: 'Acceso del personal · Staff access',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <StaffLoginView />;
}
