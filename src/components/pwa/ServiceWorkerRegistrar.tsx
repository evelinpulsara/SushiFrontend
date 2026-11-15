'use client';

import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export function ServiceWorkerRegistrar() {
  const { t } = useI18n();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined);
    }
    const update = () => setOffline(!navigator.onLine);
    queueMicrotask(update);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;
  return (
    <div role="status" className="sticky top-16 z-40 flex items-center justify-center gap-2 border-b border-gold/30 bg-gold/15 px-4 py-2 text-center text-xs text-gold backdrop-blur">
      <WifiOff className="size-3.5 shrink-0" aria-hidden="true" />
      {t.offline.banner}
    </div>
  );
}
