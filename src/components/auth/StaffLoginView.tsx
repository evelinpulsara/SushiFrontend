'use client';

import { ArrowRight, CalendarCheck, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Surface';
import { useStaffSession } from '@/hooks/useStaffSession';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';
import { StaffLoginCard } from './StaffLoginCard';

export function StaffLoginView() {
  const { t } = useI18n();
  const router = useRouter();
  const session = useStaffSession();

  return (
    <>
      <PageHeader eyebrow={t.auth.eyebrow} title={t.auth.title} subtitle={t.auth.subtitle} kanji="鍵" />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 sm:px-6">
        {session.status === 'unknown' && <LoadingBlock label={t.auth.checking} className="h-72" />}

        {session.status === 'signed-out' && (
          <StaffLoginCard notice={session.expired ? t.auth.expired : null} onSignedIn={() => router.push('/dashboard')} />
        )}

        {session.status === 'signed-in' && session.staff && (
          <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs tracking-[0.2em] text-gold uppercase">{t.auth.signedInAs}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{session.staff.displayName}</p>
              <p className="text-sm text-mist">
                {t.auth.roles[session.staff.role]} · {session.staff.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/dashboard" icon={<LayoutDashboard className="size-4" />}>
                {t.auth.goDashboard}
              </ButtonLink>
              <Button variant="secondary" icon={<LogOut className="size-4" />} onClick={() => services().auth.signOut()}>
                {t.auth.signOut}
              </Button>
            </div>
          </Card>
        )}

        <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-0.5 size-5 shrink-0 text-matcha" aria-hidden="true" />
            <div>
              <p className="font-semibold">{t.auth.guestTitle}</p>
              <p className="text-sm text-mist">{t.auth.guestText}</p>
            </div>
          </div>
          <ButtonLink href="/reservations" variant="secondary" icon={<ArrowRight className="size-4" />}>
            {t.auth.guestCta}
          </ButtonLink>
        </Card>
      </div>
    </>
  );
}
