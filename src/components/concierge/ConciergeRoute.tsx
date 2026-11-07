'use client';

import { useSearchParams } from 'next/navigation';
import { ReservationManager } from '@/lib/services/ReservationManager';
import { WaitlistManager } from '@/lib/services/WaitlistManager';
import { ConciergeView } from './ConciergeView';

export function ConciergeRoute() {
  const params = useSearchParams();
  const reservation = params.get('reservation');
  const ticket = params.get('ticket');

  const reservationCode = reservation && ReservationManager.isValidCode(reservation) ? reservation.toUpperCase() : null;
  const ticketCode = ticket && WaitlistManager.isValidTicket(ticket) ? ticket.toUpperCase() : null;

  return <ConciergeView key={`${reservationCode}-${ticketCode}`} reservationCode={reservationCode} ticketCode={ticketCode} />;
}
