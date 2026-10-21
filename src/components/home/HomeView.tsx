'use client';

import Link from 'next/link';
import { ArrowRight, Bot, CalendarDays, ChefHat, Clock, LayoutDashboard } from 'lucide-react';
import { Enso, HankoDivider, VerticalKanji } from '@/components/decor/Decor';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { ButtonLink } from '@/components/ui/Button';
import { LoadingBlock } from '@/components/ui/Spinner';
import { Badge, Card, SectionHeading } from '@/components/ui/Surface';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useResource } from '@/hooks/useResource';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';

function LiveFloorCard() {
  const { t, fill } = useI18n();
  const kpis = useResource('home-kpis', () => services().host.getKpis());
  useLiveEvents((event) => {
    if (event.name === 'kpis.updated' || event.name === 'tables.updated' || event.name === 'waitlist.updated') kpis.reload();
  });
  const data = kpis.data;

  const stats = data
    ? [
        { label: t.home.liveAvailable, value: `${data.availableTables}/${data.totalTables}` },
        { label: t.home.liveWaiting, value: String(data.waitingParties) },
        { label: t.home.liveOccupancy, value: `${Math.round(data.tableOccupancyRate)}%` },
        { label: t.home.liveAvgWait, value: fill(t.common.minutesShort, { count: data.avgCurrentWaitMinutes }) },
      ]
    : [];

  return (
    <Card className="w-full max-w-sm p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs tracking-[0.2em] text-mist uppercase">{t.home.liveTitle}</p>
        <span className="flex items-center gap-1.5 text-xs text-matcha">
          <span className="animate-pulse-soft size-1.5 rounded-full bg-matcha" />
          {t.common.live}
        </span>
      </div>
      {data ? (
        <dl className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs text-smoke">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold text-ivory">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="py-6 text-center text-sm text-smoke">{kpis.error ? t.errors.network : t.common.loading}</p>
      )}
    </Card>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="bg-seigaiha absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-torii/15 blur-[140px] lg:left-[70%]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-24">
        <div className="animate-rise">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-3 py-1 text-xs tracking-wide text-mist">
            <span className="size-1.5 rounded-full bg-torii" />
            {t.home.eyebrow}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {t.home.titleLead}
            <span className="mt-1 block bg-gradient-to-r from-torii via-[#ff6b6b] to-gold bg-clip-text text-transparent">
              {t.home.titleAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">{t.home.subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/reservations" size="lg" icon={<CalendarDays className="size-4" />}>
              {t.home.ctaReserve}
            </ButtonLink>
            <ButtonLink href="/waitlist" size="lg" variant="secondary" icon={<Clock className="size-4" />}>
              {t.home.ctaWait}
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md flex-col items-center lg:max-w-none">
          <div className="relative aspect-square w-full max-w-[420px]">
            <Enso className="absolute inset-0 size-full text-torii/80" />
            <div className="animate-float absolute inset-0 grid place-items-center">
              <span className="font-display text-[9rem] leading-none font-bold text-ivory drop-shadow-[0_10px_40px_rgba(230,57,70,0.35)] sm:text-[11rem]">
                {t.brand.kanji}
              </span>
            </div>
            <VerticalKanji text="おまかせ" className="absolute top-6 -right-2 text-lg tracking-[0.4em] text-gold/70 sm:-right-6" />
          </div>
          <div className="relative -mt-16 w-full sm:-mt-20 sm:ml-auto sm:w-auto lg:-ml-16 lg:self-start">
            <LiveFloorCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  const features = [
    { kanji: t.home.features.jikanKanji, title: t.home.features.jikanTitle, text: t.home.features.jikanText, icon: Bot, href: '/waitlist' },
    { kanji: t.home.features.itamaeKanji, title: t.home.features.itamaeTitle, text: t.home.features.itamaeText, icon: ChefHat, href: '/concierge' },
    { kanji: t.home.features.hostKanji, title: t.home.features.hostTitle, text: t.home.features.hostText, icon: LayoutDashboard, href: '/login' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow={t.home.featuresEyebrow} title={t.home.featuresTitle} align="center" />
