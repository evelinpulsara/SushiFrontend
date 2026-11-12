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
