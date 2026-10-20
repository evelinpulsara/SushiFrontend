'use client';

import Link from 'next/link';
import { HankoDivider, ToriiMark } from '@/components/decor/Decor';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative mt-24 border-t border-line bg-ink-soft">
      <div className="bg-seigaiha absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <ToriiMark className="size-7 text-torii" />
            <span className="font-display text-lg font-bold">
              {t.brand.product}
              <span className="text-torii"> AI</span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-mist">{t.footer.tagline}</p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium tracking-[0.25em] text-gold uppercase">{t.footer.hoursTitle}</h3>
          <ul className="space-y-1.5 text-sm text-mist">
            <li>{t.footer.hoursLunch}</li>
            <li>{t.footer.hoursDinner}</li>
            <li className="text-smoke">{t.footer.hoursClosed}</li>
