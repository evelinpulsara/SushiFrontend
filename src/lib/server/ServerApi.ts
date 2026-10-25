import { cacheLife, cacheTag } from 'next/cache';
import type { Menu, Reservation } from '@/domain/models';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const SERVER_TIMEOUT_MS = 8_000;

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

async function fetchData<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Accept-Language': 'es' },
    signal: AbortSignal.timeout(SERVER_TIMEOUT_MS),
  });
  const body = (await response.json()) as Envelope<T>;
  if (!response.ok || !body.success || body.data === undefined) {
    throw new Error(body.error?.code ?? `HTTP ${response.status}`);
  }
  return body.data;
}

export async function getCachedMenu(): Promise<Menu | null> {
  'use cache';
  cacheTag('menu');
  try {
    const menu = await fetchData<Menu>('/menu');
    cacheLife('hours');
    return menu;
  } catch {
    cacheLife('seconds');
    return null;
  }
}

export async function getReservationByCode(code: string): Promise<Reservation | null> {
  try {
    return await fetchData<Reservation>(`/reservations/code/${encodeURIComponent(code)}`, { cache: 'no-store' });
  } catch {
    return null;
  }
}
