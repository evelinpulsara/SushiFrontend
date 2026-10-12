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
  applicationName: 'RestoTime AI',
};

export const viewport: Viewport = {
  themeColor: '#0b0b0d',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className={`${inter.variable} ${mincho.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink font-sans text-ivory">
        <LanguageProvider>
          <Navbar />
          <ServiceWorkerRegistrar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
