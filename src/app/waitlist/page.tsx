import type { Metadata } from 'next';
import { WaitlistView } from '@/components/waitlist/WaitlistView';

export const metadata: Metadata = { title: 'Lista de espera · Waitlist' };

export default function WaitlistPage() {
  return <WaitlistView />;
}
