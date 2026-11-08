import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ConciergeRoute } from '@/components/concierge/ConciergeRoute';
import { LoadingBlock } from '@/components/ui/Spinner';

export const metadata: Metadata = { title: 'Itamae IA · Itamae AI' };

export default function ConciergePage() {
  return (
    <Suspense fallback={<LoadingBlock className="mx-auto mt-24 h-96 max-w-5xl" />}>
      <ConciergeRoute />
    </Suspense>
  );
}
