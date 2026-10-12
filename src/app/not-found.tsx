'use client';

import { ButtonLink } from '@/components/ui/Button';
import { Enso } from '@/components/decor/Decor';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="relative grid size-48 place-items-center">
        <Enso className="absolute inset-0 size-full text-torii/70" />
        <span className="font-display text-6xl font-bold">404</span>
      </div>
      <h1 className="mt-8 font-display text-3xl font-bold">{t.errors.notFoundTitle}</h1>
      <p className="mt-3 text-mist">{t.errors.notFoundText}</p>
      <ButtonLink href="/" className="mt-8">
        {t.errors.backHome}
      </ButtonLink>
    </section>
  );
}
