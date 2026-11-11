'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import type { LiveEvent } from '@/domain/models';
import { LiveEventStream, type StreamStatus, type TransportKind } from '@/lib/services/LiveEventStream';
import { services } from '@/lib/services/ServiceRegistry';

export interface LiveConnection {
  status: StreamStatus;
  transport: TransportKind | null;
  sharedTabs: number | null;
}

export function useLiveEvents(onEvent: (event: LiveEvent) => void): LiveConnection {
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const [transport, setTransport] = useState<TransportKind | null>(null);
  const [sharedTabs, setSharedTabs] = useState<number | null>(null);
  const handleEvent = useEffectEvent(onEvent);

  useEffect(() => {
    const stream = new LiveEventStream(services().api.url('/events'), {
      onEvent: (event) => handleEvent(event),
      onStatus: setStatus,
      onConnections: setSharedTabs,
    });
    stream.connect();
    const kind = stream.transportKind;
    queueMicrotask(() => setTransport(kind));
    return () => stream.close();
  }, []);

  return { status, transport, sharedTabs };
}
