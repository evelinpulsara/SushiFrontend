import type { Metadata } from 'next';
import { StaffGate } from '@/components/auth/StaffGate';
import { LabView } from '@/components/lab/LabView';

export const metadata: Metadata = {
  title: 'Laboratorio · Lab',
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <StaffGate roles={['admin']}>
      <LabView />
    </StaffGate>
  );
}
