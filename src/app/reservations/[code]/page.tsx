import { Suspense } from 'react';
import { ReservationDetailView } from '@/components/reservations/ReservationDetailView';
import { LoadingBlock } from '@/components/ui/Spinner';
import { getReservationByCode } from '@/lib/server/ServerApi';

async function ReservationLoader({ params }: { params: PageProps<'/reservations/[code]'>['params'] }) {
  const { code } = await params;
  const normalized = decodeURIComponent(code).toUpperCase();
  const reservation = await getReservationByCode(normalized);
  return <ReservationDetailView code={normalized} initialReservation={reservation} />;
}

export default function ReservationDetailPage({ params }: PageProps<'/reservations/[code]'>) {
  return (
    <Suspense fallback={<LoadingBlock className="mx-auto mt-24 h-72 max-w-3xl" />}>
      <ReservationLoader params={params} />
    </Suspense>
  );
}
