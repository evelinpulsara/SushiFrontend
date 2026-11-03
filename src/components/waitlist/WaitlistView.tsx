'use client';

import { Bot, Search, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { Allergen, WaitEstimate } from '@/domain/models';
import { WaitEstimateCard } from '@/components/ai/WaitEstimateCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { AllergenPicker, Chip, Field, Stepper, TextArea, TextInput } from '@/components/ui/Fields';
import { Card, Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { toApiError } from '@/hooks/useResource';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';
import { WaitlistManager } from '@/lib/services/WaitlistManager';

const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;

export function WaitlistView() {
  const { t, pick } = useI18n();
  const errorText = useErrorText();
  const router = useRouter();
  const info = useRestaurantInfo();

  const [partySize, setPartySize] = useState(2);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [estimate, setEstimate] = useState<WaitEstimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [ticketQuery, setTicketQuery] = useState('');

  const maxParty = info.data?.settings.maxPartySize ?? 12;
  const canJoin = guestName.trim().length >= 2 && PHONE_PATTERN.test(guestPhone.trim());

  const runEstimate = async () => {
    setEstimating(true);
    setError(null);
    try {
      setEstimate(await services().waitlist.estimate({ partySize, preferredZoneId: zoneId, dietaryRestrictions: allergens }));
    } catch (failure) {
      setError(toApiError(failure));
    } finally {
      setEstimating(false);
    }
  };

  const join = async (event: FormEvent) => {
    event.preventDefault();
    if (!canJoin || joining) return;
    setJoining(true);
    setError(null);
    try {
      const joined = await services().waitlist.join({
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        partySize,
        preferredZoneId: zoneId,
        dietaryRestrictions: allergens,
        notes: notes.trim() || null,
      });
      router.push(`/waitlist/${joined.entry.ticketCode}`);
    } catch (failure) {
      setError(toApiError(failure));
      setJoining(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow={t.waitlist.eyebrow} title={t.waitlist.title} subtitle={t.waitlist.subtitle} kanji="待" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-torii/30 bg-torii/10 text-torii">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold">{t.waitlist.estimateTitle}</h2>
                <p className="text-sm text-mist">{t.waitlist.estimateText}</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <Field label={t.reservation.stepParty}>
                <div>
                  <Stepper value={partySize} min={1} max={maxParty} onChange={(value) => { setPartySize(value); setEstimate(null); }} label={t.reservation.stepParty} />
                </div>
              </Field>
              <Field label={t.reservation.stepZone}>
                <div className="flex flex-wrap gap-2">
                  <Chip active={zoneId === null} onClick={() => { setZoneId(null); setEstimate(null); }}>
                    {t.common.noPreference}
                  </Chip>
                  {(info.data?.zones ?? []).map((zone) => (
                    <Chip key={zone.id} active={zoneId === zone.id} onClick={() => { setZoneId(zone.id); setEstimate(null); }}>
                      <span className="font-display text-torii/90">{t.zonesKanji[zone.code]}</span> {pick(zone, 'name')}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label={t.reservation.allergiesLabel} hint={t.reservation.allergiesHint}>
                <AllergenPicker value={allergens} onChange={setAllergens} />
              </Field>
              <Button onClick={runEstimate} loading={estimating} variant="gold" icon={<Bot className="size-4" />}>
                {estimating ? t.waitlist.estimating : t.waitlist.estimateButton}
              </Button>
            </div>
          </Card>

          {estimate && <WaitEstimateCard estimate={estimate} zoneName={info.zoneName} />}
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <div className="bg-washi border-b border-line p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Ticket className="size-5 text-torii" aria-hidden="true" />
                {t.waitlist.joinTitle}
              </h2>
              <p className="mt-1 text-sm text-mist">{t.waitlist.joinText}</p>
            </div>
            <form onSubmit={join} className="space-y-5 p-6" noValidate>
              <Field label={t.reservation.nameLabel} htmlFor="wl-name">
                <TextInput id="wl-name" autoComplete="name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={t.reservation.namePlaceholder} />
              </Field>
              <Field label={t.reservation.phoneLabel} htmlFor="wl-phone">
                <TextInput id="wl-phone" type="tel" autoComplete="tel" value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} placeholder={t.reservation.phonePlaceholder} />
              </Field>
              <Field label={`${t.waitlist.notesLabel} (${t.common.optional})`} htmlFor="wl-notes">
                <TextArea id="wl-notes" maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t.waitlist.notesPlaceholder} />
              </Field>
              {error && <Notice>{errorText(error)}</Notice>}
              <Button type="submit" size="lg" className="w-full" disabled={!canJoin} loading={joining}>
                {joining ? t.waitlist.joining : t.waitlist.joinButton}
              </Button>
            </form>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold">{t.waitlist.lookupTitle}</h3>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (WaitlistManager.isValidTicket(ticketQuery)) router.push(`/waitlist/${ticketQuery.trim().toUpperCase()}`);
              }}
            >
              <TextInput
                value={ticketQuery}
                onChange={(event) => setTicketQuery(event.target.value)}
                placeholder={t.waitlist.lookupPlaceholder}
                aria-label={t.waitlist.lookupTitle}
                className="font-mono uppercase"
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={!WaitlistManager.isValidTicket(ticketQuery)}
                icon={<Search className="size-4" />}
                aria-label={t.reservation.lookupButton}
              />
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
