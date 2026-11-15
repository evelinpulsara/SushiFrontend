'use client';

import { useEffect, useState } from 'react';

export type ServiceWorkerStatus = 'unsupported' | 'none' | 'registered' | 'controlling';

export function useServiceWorkerStatus(): ServiceWorkerStatus {
  const [status, setStatus] = useState<ServiceWorkerStatus>('none');

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      queueMicrotask(() => setStatus('unsupported'));
      return;
    }
    const update = () => {
      if (navigator.serviceWorker.controller) {
        setStatus('controlling');
        return;
      }
      void navigator.serviceWorker.getRegistration().then((registration) => setStatus(registration ? 'registered' : 'none'));
    };
    queueMicrotask(update);
    navigator.serviceWorker.addEventListener('controllerchange', update);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', update);
  }, []);

  return status;
}
