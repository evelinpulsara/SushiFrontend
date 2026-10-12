'use client';

import { WifiOff } from 'lucide-react';
import { Enso } from '@/components/decor/Decor';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export default function OfflinePage() {
  const { t } = useI18n();
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="relative grid size-40 place-items-center">
        <Enso className="absolute inset-0 size-full text-gold/70" />
        <WifiOff className="size-12 text-gold" aria-hidden="true" />
      </div>
      <h1 className="mt-8 font-display text-3xl font-bold">{t.offline.title}</h1>
      <p className="mt-3 text-mist">{t.offline.text}</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => window.location.reload()}>{t.offline.retry}</Button>
        <ButtonLink href="/menu" variant="secondary">
          {t.nav.menu}
        </ButtonLink>
      </div>
    </section>
  );
}
