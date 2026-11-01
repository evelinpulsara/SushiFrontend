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
