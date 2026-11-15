'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { interactionMonitor, type InpSnapshot } from '@/lib/performance/InteractionMonitor';

export function useInteractionMetrics(): InpSnapshot {
  useEffect(() => interactionMonitor.start(), []);
  return useSyncExternalStore(interactionMonitor.subscribe, interactionMonitor.getSnapshot, interactionMonitor.getServerSnapshot);
}
