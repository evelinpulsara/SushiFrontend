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
    setError(null);
    setDraft('');
    setHistory([...session.history, { id: 'pending', role: 'user', content, turn: null }]);
    try {
      setHistory(await session.send(content, allergens));
    } catch (failure) {
      setError(toApiError(failure));
      setHistory(session.history);
      setDraft(content);
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  const restart = () => {
    setSession(new ConciergeSession(services().api, { reservationCode, ticketCode }));
    setHistory([]);
    setError(null);
  };

  const linkedCode = reservationCode ?? ticketCode;

  return (
    <>
      <PageHeader eyebrow={t.concierge.eyebrow} title={t.concierge.title} subtitle={t.concierge.subtitle} kanji="板" />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {linkedCode && (
            <Badge tone="gold" className="px-3 py-1 text-xs">
              {fill(t.concierge.linked, { code: linkedCode })}
            </Badge>
          )}
          <Card className="p-5">
            <h2 className="text-sm font-semibold">{t.concierge.allergiesTitle}</h2>
            <p className="mt-1 mb-4 text-xs text-smoke">{t.concierge.allergiesHint}</p>
            <AllergenPicker value={allergens} onChange={setAllergens} />
            <p className="mt-4 text-xs text-smoke">{t.concierge.allergyNotice}</p>
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold">{t.concierge.suggestionsTitle}</h2>
            <ul className="space-y-2">
              {t.concierge.suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void send(suggestion)}
                    className="w-full rounded-xl border border-line-strong bg-ink-soft px-3 py-2 text-left text-sm text-mist transition hover:border-torii/40 hover:text-ivory disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={restart} icon={<RotateCcw className="size-4" />} disabled={busy}>
              {t.concierge.newChat}
            </Button>
          )}
        </aside>

        <Card className="flex min-h-[640px] flex-col overflow-hidden">
          <div className="scroll-thin flex-1 space-y-6 overflow-y-auto p-5 sm:p-6" aria-live="polite">
            <div className="flex gap-3">
              <ItamaeAvatar />
              <p className="rounded-2xl rounded-tl-md border border-line bg-surface-raised px-4 py-3 text-sm leading-relaxed text-ivory/95">
                {t.concierge.greeting}
              </p>
            </div>

            {history.map((entry) => (
              <MessageBubble key={entry.id} entry={entry} onFollowUp={(text) => void send(text)} busy={busy} />
            ))}

            {busy && (
              <div className="flex items-center gap-3 text-sm text-mist">
                <ItamaeAvatar />
                <Spinner className="size-4 text-torii" />
                {t.concierge.thinking}
              </div>
            )}
            {error && <Notice>{errorText(error)}</Notice>}
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="flex items-end gap-3 border-t border-line bg-ink-soft/70 p-4">
            <label htmlFor="concierge-input" className="sr-only">
              {t.concierge.placeholder}
            </label>
            <textarea
              id="concierge-input"
              value={draft}
              maxLength={1000}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              placeholder={t.concierge.placeholder}
              className="max-h-40 min-h-11 flex-1 resize-none rounded-2xl border border-line-strong bg-ink px-4 py-3 text-sm text-ivory placeholder:text-smoke focus:border-torii/70 focus:outline-none focus:ring-2 focus:ring-torii/20"
            />
            <Button type="submit" size="lg" disabled={!draft.trim()} loading={busy} icon={<Send className="size-4" />} aria-label={t.concierge.send}>
              <span className="hidden sm:inline">{t.concierge.send}</span>
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
