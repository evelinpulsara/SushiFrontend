import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  kanji,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  kanji: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative mb-10 overflow-hidden border-b border-line">
      <div className="bg-seigaiha absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="absolute -top-32 -right-20 size-[420px] rounded-full bg-torii/10 blur-[120px]" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-display text-[10rem] leading-none font-bold text-ivory/[0.04] sm:right-12 sm:text-[14rem]"
      >
        {kanji}
      </span>
      <div className="animate-rise relative mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.25em] text-torii uppercase">
          <span className="h-px w-6 bg-torii/60" />
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
