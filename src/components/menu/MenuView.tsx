'use client';

import { useDeferredValue, useState } from 'react';
import type { Allergen, Menu } from '@/domain/models';
import { HankoDivider } from '@/components/decor/Decor';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { Button } from '@/components/ui/Button';
import { AllergenPicker, Chip } from '@/components/ui/Fields';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Card, Notice } from '@/components/ui/Surface';
import { PageHeader } from '@/components/layout/PageHeader';
import { useErrorText } from '@/hooks/useErrorText';
import { useResource } from '@/hooks/useResource';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';

export function MenuView({ initialMenu = null }: { initialMenu?: Menu | null }) {
  const { t, pick } = useI18n();
  const errorText = useErrorText();
  const [excluded, setExcluded] = useState<Allergen[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const deferredCategory = useDeferredValue(category);

  const key = `menu:${[...excluded].sort().join(',')}`;
  const menu = useResource(key, () => services().menu.getMenu({ excludeAllergens: excluded }), initialMenu);
  const categories = menu.data?.categories ?? [];
  const visible = deferredCategory ? categories.filter((entry) => entry.slug === deferredCategory) : categories;

  return (
    <>
      <PageHeader eyebrow={t.menu.eyebrow} title={t.menu.title} subtitle={t.menu.subtitle} kanji="品" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ivory">{t.menu.excludeTitle}</h2>
              <p className="text-xs text-smoke">{t.menu.excludeHint}</p>
            </div>
            {excluded.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setExcluded([])}>
                {t.menu.clearFilters}
              </Button>
            )}
          </div>
          <div className="mt-4">
            <AllergenPicker value={excluded} onChange={setExcluded} />
          </div>
        </Card>

        <div className="scroll-thin sticky top-16 z-30 -mx-4 mt-6 flex gap-2 overflow-x-auto border-b border-line bg-ink/85 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-full sm:border sm:px-3">
          <Chip active={category === null} onClick={() => setCategory(null)}>
            {t.menu.allCategories}
          </Chip>
          {categories.map((entry) => (
            <Chip key={entry.slug} active={category === entry.slug} onClick={() => setCategory(entry.slug)} className="shrink-0">
              <span className="font-display">{entry.nameJa}</span> · {pick(entry, 'name')}
            </Chip>
          ))}
        </div>

        <div className="mt-10 space-y-16">
          {menu.error && !menu.data && (
            <Notice action={<Button size="sm" variant="secondary" onClick={menu.reload}>{t.common.retry}</Button>}>
              {errorText(menu.error)}
            </Notice>
          )}
