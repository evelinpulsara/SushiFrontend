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
  z.object({ type: z.literal('welcome'), clientId: z.string(), instanceId: z.string(), peers: z.array(presencePeerSchema) }),
  z.object({ type: z.literal('presence'), peers: z.array(presencePeerSchema) }),
  z.object({ type: z.literal('events'), events: z.array(z.object({ name: z.string(), occurredAt: z.string() }).passthrough()) }),
  z.object({ type: z.literal('pong'), at: z.string() }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export type PresencePeer = z.infer<typeof presencePeerSchema>;
export type ServerMessage = z.infer<typeof serverMessageSchema>;

export const sharedWorkerMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('event'), data: z.string() }),
  z.object({ type: z.literal('status'), status: z.enum(['connecting', 'open', 'reconnecting']) }),
  z.object({ type: z.literal('connections'), count: z.number().int() }),
]);
