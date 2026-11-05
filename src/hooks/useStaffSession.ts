'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { staffSession, type StaffSnapshot } from '@/lib/auth/StaffSessionStore';

export function useStaffSession(): StaffSnapshot {
  useEffect(() => staffSession.restore(), []);
  return useSyncExternalStore(staffSession.subscribe, staffSession.getSnapshot, staffSession.getServerSnapshot);
}
