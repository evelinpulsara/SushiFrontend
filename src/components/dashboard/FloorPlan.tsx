'use client';

import type { DiningTable, TableShape, TableStatus } from '@/domain/models';
import { STATUS_DOT } from '@/components/ui/Surface';
import { useI18n } from '@/lib/i18n/LanguageProvider';

const STATUS_STYLES: Record<TableStatus, string> = {
  available: 'border-matcha/60 bg-matcha/10 text-matcha',
  occupied: 'border-torii/70 bg-torii/15 text-[#ff8a93]',
  reserved: 'border-gold/70 bg-gold/10 text-gold',
  clearing_soon: 'border-aiiro/80 bg-aiiro/15 text-[#9fb6e0]',
};

function shapeClasses(shape: TableShape, capacity: number): string {
  switch (shape) {
    case 'bar_counter':
      return 'h-12 w-[4.5rem] rounded-md';
    case 'round':
      return capacity <= 2 ? 'size-14 rounded-full' : 'size-[4.5rem] rounded-full';
    case 'rectangle':
      return 'h-16 w-28 rounded-xl';
    case 'tatami':
      return 'h-20 w-32 rounded-md';
    default:
      return capacity <= 2 ? 'size-14 rounded-xl' : 'size-[4.5rem] rounded-xl';
  }
}

interface ZoneArea {
  code: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

function zoneAreas(tables: readonly DiningTable[], label: (table: DiningTable) => string): ZoneArea[] {
  const groups = new Map<string, DiningTable[]>();
  for (const table of tables) {
    groups.set(table.zone.code, [...(groups.get(table.zone.code) ?? []), table]);
  }
  return [...groups.entries()].map(([code, members]) => {
    const xs = members.map((table) => table.position.x);
    const ys = members.map((table) => table.position.y);
    const left = Math.max(0.5, Math.min(...xs) - 7);
    const top = Math.max(0.5, Math.min(...ys) - 9);
    const right = Math.min(99.5, Math.max(...xs) + 7);
    const bottom = Math.min(99.5, Math.max(...ys) + 9);
    return { code, label: label(members[0]!), left, top, width: right - left, height: bottom - top };
  });
}

export function FloorPlan({
  tables,
  selectedId,
  onSelect,
  handledBy = new Map(),
}: {
  tables: readonly DiningTable[];
  selectedId: string | null;
  onSelect: (table: DiningTable) => void;
  handledBy?: ReadonlyMap<string, string>;
}) {
  const { t, fill, pick } = useI18n();
