import { Suspense } from 'react';
import { LoadingBlock } from '@/components/ui/Spinner';
import { TicketView } from '@/components/waitlist/TicketView';

async function TicketLoader({ params }: { params: PageProps<'/waitlist/[ticket]'>['params'] }) {
  const { ticket } = await params;
  return <TicketView ticketCode={decodeURIComponent(ticket).toUpperCase()} />;
}

export default function TicketPage({ params }: PageProps<'/waitlist/[ticket]'>) {
  return (
    <Suspense fallback={<LoadingBlock className="mx-auto mt-24 h-80 max-w-4xl" />}>
      <TicketLoader params={params} />
    </Suspense>
  );
}
