import type {
  Availability,
  DayAvailability,
  CreatedReservation,
  NewReservation,
  Reservation,
  ReservationStatus,
} from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';

export class ReservationManager {
  public constructor(private readonly api: ApiClient) {}

  public checkDay(query: { date: string; partySize: number; zoneId: string | null }): Promise<DayAvailability> {
    return this.api.get<DayAvailability>('/availability/day', query);
  }

  public cancelByCode(code: string): Promise<Reservation> {
    return this.api.post<Reservation>(`/reservations/code/${encodeURIComponent(code.trim().toUpperCase())}/cancel`);
  }

  public checkAvailability(query: { date: string; time: string; partySize: number; zoneId: string | null }): Promise<Availability> {
    return this.api.get<Availability>('/availability', query);
  }
