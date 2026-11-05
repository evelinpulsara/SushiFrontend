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
