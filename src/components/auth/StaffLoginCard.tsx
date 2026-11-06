'use client';

import { Eye, EyeOff, KeyRound, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { StaffSession } from '@/domain/models';
import { Button } from '@/components/ui/Button';
import { Field, TextInput } from '@/components/ui/Fields';
import { Card, Notice } from '@/components/ui/Surface';
import { useErrorText } from '@/hooks/useErrorText';
import { toApiError } from '@/hooks/useResource';
import type { ApiError } from '@/lib/api/ApiClient';
import { DemoAccounts } from '@/lib/auth/DemoAccounts';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';

export function StaffLoginCard({ onSignedIn, notice }: { onSignedIn?: (session: StaffSession) => void; notice?: string | null }) {
  const { t } = useI18n();
  const errorText = useErrorText();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const demos = DemoAccounts.visible;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const session = await services().auth.signIn(email.trim(), password);
      onSignedIn?.(session);
    } catch (failure) {
      setError(toApiError(failure));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="animate-rise overflow-hidden">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <form onSubmit={submit} className="space-y-5 p-6 sm:p-8" noValidate>
          <div className="space-y-3">
            <span className="grid size-11 place-items-center rounded-2xl border border-torii/40 bg-torii/10 text-torii">
              <KeyRound className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-ivory">{t.auth.gateTitle}</h2>
            <p className="text-sm leading-relaxed text-mist">{t.auth.gateText}</p>
          </div>

          {notice && <Notice tone="info">{notice}</Notice>}

          <Field label={t.auth.emailLabel} htmlFor="staff-email">
            <TextInput
              id="staff-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@kurenai.demo"
            />
          </Field>
          <Field label={t.auth.passwordLabel} htmlFor="staff-password">
            <div className="relative">
              <TextInput
                id="staff-password"
                type={reveal ? 'text' : 'password'}
                autoComplete="current-password"
                required
