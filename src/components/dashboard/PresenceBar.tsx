'use client';

import { Users } from 'lucide-react';
import type { HostPresence } from '@/hooks/useHostPresence';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export function PresenceBar({ presence, tableCodeOf }: { presence: HostPresence; tableCodeOf: (tableId: string) => string | null }) {
  const { t, fill } = useI18n();
  const open = presence.status === 'open';

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3">
      <span className="flex items-center gap-2 text-xs text-mist">
        <Users className="size-4 text-gold" aria-hidden="true" />
        {t.presence.title}
      </span>
      <ul className="flex flex-wrap gap-2">
        {presence.peers.map((peer) => {
          const isMe = peer.clientId === presence.clientId;
          const table = peer.tableId ? tableCodeOf(peer.tableId) : null;
          return (
            <li
              key={peer.clientId}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                isMe ? 'border-gold/50 bg-gold/10 text-gold' : 'border-line-strong bg-ink-soft text-ivory'
              }`}
            >
              <span className="grid size-5 place-items-center rounded-full bg-torii/80 text-[11px] font-bold text-ivory">
                {peer.hostName.slice(0, 1).toUpperCase()}
              </span>
              {peer.hostName}
              {isMe && <span className="text-[11px] opacity-70">({t.presence.you})</span>}
              {table && <span className="rounded bg-surface-raised px-1.5 font-display text-[11px] text-mist">{table}</span>}
            </li>
          );
        })}
      </ul>
      <span
        className={`ml-auto flex items-center gap-1.5 text-xs ${open ? 'text-matcha' : 'text-gold'}`}
        title={presence.instanceId ? fill(t.presence.instance, { id: presence.instanceId }) : undefined}
      >
        <span className={`size-1.5 rounded-full ${open ? 'bg-matcha' : 'bg-gold'}`} />
        {open ? t.presence.open : t.presence.reconnecting}
      </span>
    </div>
  );
}
