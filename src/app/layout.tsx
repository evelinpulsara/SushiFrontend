import type { Metadata, Viewport } from 'next';
import { Inter, Shippori_Mincho } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { es } from '@/lib/i18n/dictionaries/es';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const mincho = Shippori_Mincho({
  variable: '--font-mincho',
  weight: ['500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: es.meta.title, template: `%s · ${es.brand.product} AI` },
  description: es.meta.description,
