import type { Metadata } from 'next';
import { ReservationView } from '@/components/reservations/ReservationView';

export const metadata: Metadata = { title: 'Reservar · Book' };

export default function ReservationsPage() {
  return <ReservationView />;
}
