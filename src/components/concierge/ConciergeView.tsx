'use client';

import { RotateCcw, Send } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Allergen, ConciergeTurn } from '@/domain/models';
import { PageHeader } from '@/components/layout/PageHeader';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { Button } from '@/components/ui/Button';
import { AllergenPicker } from '@/components/ui/Fields';
import { Spinner } from '@/components/ui/Spinner';
import { Badge, Card, Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { toApiError } from '@/hooks/useResource';
import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { ConciergeSession, type ChatEntry } from '@/lib/services/ConciergeSession';
import { services } from '@/lib/services/ServiceRegistry';

function ItamaeAvatar() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-torii/40 bg-torii/15 font-display text-sm text-torii" aria-hidden="true">
      板
    </span>
  );
}

function AssistantTurn({ turn, onFollowUp, disabled }: { turn: ConciergeTurn; onFollowUp: (text: string) => void; disabled: boolean }) {
  const { t, format } = useI18n();
  return (
    <div className="mt-4 space-y-4">
      {turn.recommendations.length > 0 && (
        <div>
          <p className="mb-2 text-xs tracking-[0.2em] text-smoke uppercase">{t.concierge.recommended}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {turn.recommendations.map((recommendation) => (
              <MenuItemCard key={recommendation.item.id} item={recommendation.item} currencyCode={turn.currencyCode} reason={recommendation.reason} />
            ))}
          </div>
        </div>
      )}

      {turn.suggestedSequence.length > 1 && (
        <div>
          <p className="mb-2 text-xs tracking-[0.2em] text-smoke uppercase">{t.concierge.sequence}</p>
          <ol className="flex flex-wrap items-center gap-2">
            {turn.suggestedSequence.map((item, index) => (
              <li key={item.id} className="flex items-center gap-2">
                <span className="flex items-center gap-2 rounded-full border border-line-strong bg-ink-soft px-3 py-1 text-xs">
                  <span className="grid size-5 place-items-center rounded-full bg-torii text-[11px] font-bold text-ivory">{index + 1}</span>
                  {item.name}
                </span>
                {index < turn.suggestedSequence.length - 1 && <span className="text-smoke">→</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {turn.estimatedTotal > 0 && (
          <span className="text-sm text-mist">
            {t.concierge.total}: <span className="font-display font-semibold text-gold">{format.currency(turn.estimatedTotal)}</span>
          </span>
        )}
        {turn.isFallback && <Badge tone="aiiro">{t.concierge.fallbackNote}</Badge>}
      </div>

      {turn.followUpQuestion && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onFollowUp(turn.followUpQuestion!)}
          className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-2 text-left text-sm text-gold transition hover:bg-gold/10 disabled:opacity-50"
        >
          {turn.followUpQuestion}
        </button>
      )}
    </div>
  );
}

function MessageBubble({ entry, onFollowUp, busy }: { entry: ChatEntry; onFollowUp: (text: string) => void; busy: boolean }) {
  if (entry.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="animate-rise max-w-[85%] rounded-2xl rounded-br-md bg-torii px-4 py-3 text-sm leading-relaxed text-ivory">{entry.content}</p>
      </div>
    );
  }
  return (
    <div className="animate-rise flex gap-3">
      <ItamaeAvatar />
      <div className="min-w-0 flex-1">
        <p className="rounded-2xl rounded-tl-md border border-line bg-surface-raised px-4 py-3 text-sm leading-relaxed text-ivory/95">{entry.content}</p>
        {entry.turn && <AssistantTurn turn={entry.turn} onFollowUp={onFollowUp} disabled={busy} />}
      </div>
    </div>
  );
}

export function ConciergeView({ reservationCode, ticketCode }: { reservationCode: string | null; ticketCode: string | null }) {
  const { t, fill } = useI18n();
  const errorText = useErrorText();
  const [session, setSession] = useState(() => new ConciergeSession(services().api, { reservationCode, ticketCode }));
  const [history, setHistory] = useState<readonly ChatEntry[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [history.length, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
