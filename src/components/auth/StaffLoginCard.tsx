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
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setReveal((value) => !value)}
                aria-label={reveal ? t.auth.hidePassword : t.auth.showPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-mist hover:text-ivory"
              >
                {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>

          {error && <Notice>{errorText(error)}</Notice>}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting}
            disabled={email.trim().length < 5 || password.length < 8}
            icon={<LogIn className="size-4" />}
          >
            {submitting ? t.auth.submitting : t.auth.submit}
          </Button>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-smoke">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-matcha" aria-hidden="true" />
            {t.auth.security}
          </p>
        </form>

        {demos.length > 0 && (
          <div className="border-t border-line bg-washi p-6 sm:p-8 md:border-t-0 md:border-l">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              <Sparkles className="size-4" aria-hidden="true" />
              {t.auth.demoTitle}
            </p>
            <p className="mt-1 text-sm text-mist">{t.auth.demoHint}</p>
            <ul className="mt-5 space-y-3">
              {demos.map((account) => (
                <li key={account.email}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setError(null);
                    }}
                    className="group w-full rounded-2xl border border-line-strong bg-ink/60 p-4 text-left transition hover:border-gold/60 hover:bg-gold/5"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ivory">{t.auth.roles[account.role]}</span>
                      <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-xs text-gold transition group-hover:bg-gold/15">
                        {t.auth.useDemo}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-mist">{t.auth.roleAccess[account.role]}</span>
                    <span className="mt-3 block font-mono text-[13px] text-ivory/90">{account.email}</span>
                    <span className="block font-mono text-[13px] text-mist">{account.password}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
