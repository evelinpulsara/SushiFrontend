'use client';

import { FlaskConical, KeyRound, LayoutDashboard, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import type { StaffMember } from '@/domain/models';
import { ToriiMark } from '@/components/decor/Decor';
import { ButtonLink } from '@/components/ui/Button';
import { useStaffSession } from '@/hooks/useStaffSession';
import { useI18n } from '@/lib/i18n/LanguageProvider';
import { services } from '@/lib/services/ServiceRegistry';
import { LanguageSwitcher } from './LanguageSwitcher';

type Layout = 'desktop' | 'mobile';

interface NavLink {
  href: string;
  label: string;
  staffOnly?: boolean;
  icon?: typeof LayoutDashboard;
}

function useLinks(staff: StaffMember | null): NavLink[] {
  const { t } = useI18n();
  const links: NavLink[] = [
    { href: '/', label: t.nav.home },
    { href: '/menu', label: t.nav.menu },
    { href: '/reservations', label: t.nav.reserve },
    { href: '/waitlist', label: t.nav.waitlist },
    { href: '/concierge', label: t.nav.concierge },
  ];
  if (staff) links.push({ href: '/dashboard', label: t.nav.dashboard, staffOnly: true, icon: LayoutDashboard });
  if (staff?.role === 'admin') links.push({ href: '/lab', label: t.nav.lab, staffOnly: true, icon: FlaskConical });
  return links;
}

function NavLinks({ activePath, layout, onNavigate }: { activePath: string | null; layout: Layout; onNavigate?: () => void }) {
  const { t } = useI18n();
  const { staff } = useStaffSession();
  const links = useLinks(staff);
  const isActive = (href: string) =>
    activePath !== null && (href === '/' ? activePath === '/' : activePath.startsWith(href));

  if (layout === 'mobile') {
    const publicLinks = links.filter((link) => !link.staffOnly);
    const staffLinks = links.filter((link) => link.staffOnly);
    const item = (link: NavLink) => (
      <li key={link.href}>
        <Link
          href={link.href}
          onClick={onNavigate}
          aria-current={isActive(link.href) ? 'page' : undefined}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-base ${
            isActive(link.href)
              ? 'bg-torii/15 text-ivory'
              : link.staffOnly
                ? 'text-gold hover:bg-surface'
                : 'text-mist hover:bg-surface hover:text-ivory'
          }`}
        >
          {link.icon && <link.icon className="size-4" aria-hidden="true" />}
          {link.label}
        </Link>
      </li>
    );
    return (
      <div className="space-y-3">
        <ul className="grid gap-1">{publicLinks.map(item)}</ul>
        {staffLinks.length > 0 && (
          <div>
            <p className="px-4 pb-1 text-xs tracking-[0.2em] text-smoke uppercase">{t.nav.adminGroup}</p>
            <ul className="grid gap-1">{staffLinks.map(item)}</ul>
          </div>
        )}
        <div className="border-t border-line px-4 pt-3 sm:hidden">
          {staff ? (
            <button
              type="button"
              onClick={() => {
                services().auth.signOut();
                onNavigate?.();
              }}
              className="flex w-full items-center justify-between rounded-xl text-base text-gold"
            >
              <span className="truncate">{staff.displayName}</span>
              <span className="flex items-center gap-1.5 text-sm">
                <LogOut className="size-4" aria-hidden="true" />
                {t.auth.signOut}
              </span>
            </button>
          ) : (
            <Link href="/login" onClick={onNavigate} className="flex items-center gap-2 text-base text-mist hover:text-gold">
              <KeyRound className="size-4" aria-hidden="true" />
              {t.auth.title}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <ul className="hidden items-center gap-0.5 lg:flex">
      {links.map((link, index) => (
        <li key={link.href} className="flex items-center">
          {link.staffOnly && !links[index - 1]?.staffOnly && <span className="mx-1.5 h-5 w-px bg-line-strong" aria-hidden="true" />}
          <Link
            href={link.href}
            aria-current={isActive(link.href) ? 'page' : undefined}
            className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm whitespace-nowrap transition-colors xl:px-3 xl:text-[15px] ${
              isActive(link.href) ? 'text-ivory' : link.staffOnly ? 'text-gold/90 hover:text-gold' : 'text-mist hover:text-ivory'
            }`}
          >
            {link.icon && <link.icon className="size-4" aria-hidden="true" />}
            {link.label}
            {isActive(link.href) && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-torii" aria-hidden="true" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ActiveNavLinks(props: { layout: Layout; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <NavLinks activePath={pathname} {...props} />;
}

function ResponsiveNavLinks(props: { layout: Layout; onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavLinks activePath={null} {...props} />}>
      <ActiveNavLinks {...props} />
    </Suspense>
  );
}

function StaffControl() {
  const { t } = useI18n();
  const { staff } = useStaffSession();

  if (!staff) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm text-mist transition hover:border-gold/50 hover:text-gold"
        title={t.auth.title}
      >
        <KeyRound className="size-3.5" aria-hidden="true" />
        {t.nav.staff}
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 py-1 pr-1 pl-1">
      <span className="grid size-7 place-items-center rounded-full bg-gold font-display text-sm font-bold text-ink" aria-hidden="true">
        {staff.displayName.slice(0, 1).toUpperCase()}
      </span>
      <span className="hidden max-w-32 truncate px-1 text-sm text-gold 2xl:block" title={`${t.auth.signedInAs} ${staff.displayName}`}>
        {staff.displayName}
      </span>
      <button
        type="button"
        onClick={() => services().auth.signOut()}
        className="grid size-7 place-items-center rounded-full text-gold transition hover:bg-gold/20"
        aria-label={t.auth.signOut}
        title={t.auth.signOut}
      >
        <LogOut className="size-3.5" />
      </button>
    </span>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap" onClick={() => setOpen(false)}>
          <ToriiMark className="size-8 text-torii transition-transform duration-500 group-hover:-translate-y-0.5" />
          <span className="leading-none">
            <span className="block font-display text-lg font-bold tracking-wide text-ivory">
              {t.brand.product}
              <span className="text-torii"> AI</span>
            </span>
            <span className="hidden text-xs tracking-[0.3em] text-mist uppercase sm:block">
              {t.brand.kanji} {t.brand.restaurant}
            </span>
          </span>
        </Link>

        <ResponsiveNavLinks layout="desktop" />

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <span className="hidden sm:block">
            <StaffControl />
          </span>
          <span className="hidden sm:block lg:hidden 2xl:block">
            <ButtonLink href="/reservations" size="sm">
              {t.nav.bookCta}
            </ButtonLink>
          </span>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-line-strong text-mist lg:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink/95 px-4 py-3 lg:hidden">
          <ResponsiveNavLinks layout="mobile" onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
