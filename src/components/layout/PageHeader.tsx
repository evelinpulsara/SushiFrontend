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
