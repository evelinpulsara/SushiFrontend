'use client';

import { useEffect, useRef, useState } from 'react';
import { staffSession } from '@/lib/auth/StaffSessionStore';
import { HostCollaborationClient, type SocketStatus } from '@/lib/realtime/HostCollaborationClient';
import type { PresencePeer } from '@/lib/realtime/schemas';
import { services } from '@/lib/services/ServiceRegistry';

export interface HostPresence {
  status: SocketStatus;
  peers: PresencePeer[];
  clientId: string | null;
  instanceId: string | null;
  focus: (tableId: string | null) => void;
}

export function useHostPresence(): HostPresence {
  const [status, setStatus] = useState<SocketStatus>('connecting');
  const [peers, setPeers] = useState<PresencePeer[]>([]);
  const [identity, setIdentity] = useState<{ clientId: string | null; instanceId: string | null }>({ clientId: null, instanceId: null });
  const client = useRef<HostCollaborationClient | null>(null);

  useEffect(() => {
    const url = services().api.url('/ws').replace(/^http/, 'ws');
    const connection = new HostCollaborationClient(url, () => staffSession.token, {
      onPresence: setPeers,
      onStatus: setStatus,
      onWelcome: (clientId, instanceId) => setIdentity({ clientId, instanceId }),
    });
    client.current = connection;
    connection.connect();
    return () => {
      connection.close();
      client.current = null;
    };
  }, []);

  return {
    status,
    peers,
    clientId: identity.clientId,
    instanceId: identity.instanceId,
    focus: (tableId) => client.current?.focus(tableId),
  };
}
