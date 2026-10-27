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
