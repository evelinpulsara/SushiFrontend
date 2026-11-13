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
  const areas = zoneAreas(tables, (table) => `${t.zonesKanji[table.zone.code] ?? ''} ${pick(table.zone, 'name')}`);

  return (
    <div>
      <div className="scroll-thin overflow-x-auto rounded-2xl border border-line bg-ink-soft">
        <div className="bg-seigaiha relative aspect-[16/10] min-w-[760px]">
          {areas.map((area) => (
            <div
              key={area.code}
              className="absolute rounded-2xl border border-dashed border-line-strong/80 bg-surface/30"
              style={{ left: `${area.left}%`, top: `${area.top}%`, width: `${area.width}%`, height: `${area.height}%` }}
            >
              <span className="absolute -top-2.5 left-3 whitespace-nowrap bg-ink-soft px-2 font-display text-xs tracking-wide text-mist">{area.label}</span>
            </div>
          ))}

          {tables.map((table) => {
            const selected = table.id === selectedId;
            const seating = table.currentSeating;
            return (
              <button
                key={table.id}
                type="button"
                onClick={() => onSelect(table)}
                aria-pressed={selected}
                aria-label={`${t.common.table} ${table.code} · ${t.statuses.table[table.effectiveStatus]}`}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-2 transition-all duration-300 hover:scale-105 ${shapeClasses(
                  table.shape,
                  table.capacity,
                )} ${STATUS_STYLES[table.effectiveStatus]} ${selected ? 'z-10 scale-110 ring-2 ring-ivory/80 ring-offset-2 ring-offset-ink' : ''} ${
                  table.shape === 'tatami' ? 'outline outline-1 -outline-offset-4 outline-current/30' : ''
                }`}
                style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
              >
                <span className="font-display text-sm leading-none font-bold text-ivory">{table.code}</span>
                <span className="mt-0.5 text-[11px] leading-none opacity-80">
                  {seating ? `${seating.partySize}/${table.capacity}` : table.capacity}
                </span>
                {handledBy.has(table.id) && (
                  <span className="absolute -top-2.5 -right-2.5 grid size-5 place-items-center rounded-full border border-ink bg-gold text-[9px] font-bold text-ink" title={handledBy.get(table.id)}>
                    {handledBy.get(table.id)!.slice(0, 1).toUpperCase()}
                  </span>
                )}
                {seating && (
                  <span className="mt-0.5 text-[9px] leading-none opacity-80">
                    {seating.minutesRemaining > 0 ? fill(t.common.minutesShort, { count: seating.minutesRemaining }) : '⌛'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-mist" aria-label={t.dashboard.legend}>
        {(['available', 'occupied', 'reserved', 'clearing_soon'] as const).map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${STATUS_DOT[status]}`} />
            {t.statuses.table[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
