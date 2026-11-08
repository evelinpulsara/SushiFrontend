import { z } from 'zod';

export const liveEventSchema = z.object({
  name: z.enum(['tables.updated', 'waitlist.updated', 'reservations.updated', 'kpis.updated']),
  occurredAt: z.string(),
  payload: z.record(z.string(), z.unknown()),
});

export const presencePeerSchema = z.object({
  clientId: z.string(),
  hostName: z.string(),
  tableId: z.string().nullable(),
});

export const serverMessageSchema = z.discriminatedUnion('type', [
