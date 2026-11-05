'use client';

import { ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StaffRole } from '@/domain/models';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Surface';
import { useStaffSession } from '@/hooks/useStaffSession';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';
import { StaffLoginCard } from './StaffLoginCard';

export function StaffGate({ roles = [], children }: { roles?: StaffRole[]; children: ReactNode }) {
  const { t, fill } = useI18n();
  const session = useStaffSession();

  if (session.status === 'unknown') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <LoadingBlock label={t.auth.checking} className="h-72" />
      </div>
    );
  }

  if (session.status === 'signed-out' || !session.staff) {
    return (
      <>
        <PageHeader eyebrow={t.auth.eyebrow} title={t.auth.title} subtitle={t.auth.subtitle} kanji="鍵" />
        <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <StaffLoginCard notice={session.expired ? t.auth.expired : null} />
        </div>
      </>
    );
  }

  if (roles.length > 0 && !roles.includes(session.staff.role)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <Card className="p-8 text-center">
          <ShieldAlert className="mx-auto size-10 text-gold" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-semibold">{t.auth.forbiddenTitle}</h1>
          <p className="mt-2 text-mist">{fill(t.auth.forbiddenText, { role: t.auth.roles[session.staff.role] })}</p>
          <Button className="mt-6" variant="secondary" onClick={() => services().auth.signOut()}>
            {t.auth.switchAccount}
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
