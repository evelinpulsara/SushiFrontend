'use client';

import { Flame, Wine } from 'lucide-react';
import type { MenuItem } from '@/domain/models';
import { Badge } from '@/components/ui/Surface';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const HIGHLIGHT_TAGS = new Set(['signature', 'vegan', 'vegetarian', 'gluten_free', 'non_alcoholic']);

export function MenuItemCard({ item, currencyCode, reason }: { item: MenuItem; currencyCode: string; reason?: string }) {
  const { t, language, pick, fill } = useI18n();
  const currency = new Intl.NumberFormat(language === 'es' ? 'es-CO' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  });
  const pairing = pick(item, 'pairingNotes');

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-torii/40 hover:shadow-[0_20px_50px_-30px_rgba(230,57,70,0.6)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -bottom-5 font-display text-7xl font-bold text-ivory/[0.04] transition-colors duration-500 group-hover:text-torii/10"
      >
        {item.nameJa.slice(0, 2)}
      </span>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-sm text-torii">{item.nameJa}</p>
          <h3 className="mt-0.5 font-display text-lg leading-snug font-semibold text-ivory">{item.name}</h3>
        </div>
        <p className="shrink-0 font-display text-base font-semibold text-gold">{currency.format(item.price)}</p>
      </div>

      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-mist">{pick(item, 'description')}</p>

      {reason && (
        <p className="relative mt-3 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-xs leading-relaxed text-gold/90">{reason}</p>
      )}

      <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
        {item.pieces && <Badge>{fill(t.common.piecesCount, { count: item.pieces })}</Badge>}
        {item.alcoholPercentage !== null && <Badge>{fill(t.menu.abv, { value: item.alcoholPercentage })}</Badge>}
        {item.spiceLevel > 0 && (
          <Badge tone="torii" className="gap-0.5">
            <span className="sr-only">{fill(t.menu.spicy, { level: item.spiceLevel })}</span>
            {Array.from({ length: item.spiceLevel }, (_, index) => (
              <Flame key={index} className="size-3" aria-hidden="true" />
