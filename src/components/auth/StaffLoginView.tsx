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
