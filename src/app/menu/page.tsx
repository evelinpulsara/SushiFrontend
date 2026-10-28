import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MenuView } from '@/components/menu/MenuView';
import { getCachedMenu } from '@/lib/server/ServerApi';

export const metadata: Metadata = { title: 'Carta · Menu' };

async function CachedMenu() {
  const initialMenu = await getCachedMenu();
  return <MenuView initialMenu={initialMenu} />;
}

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuView initialMenu={null} />}>
      <CachedMenu />
    </Suspense>
  );
}
