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

  public create(input: NewReservation): Promise<CreatedReservation> {
    return this.api.post<CreatedReservation>('/reservations', input);
  }

  public findByCode(code: string): Promise<Reservation> {
    return this.api.get<Reservation>(`/reservations/code/${encodeURIComponent(code.trim().toUpperCase())}`);
  }

  public listForDate(date?: string): Promise<Reservation[]> {
    return this.api.get<Reservation[]>('/reservations', { date });
  }

  public updateStatus(id: string, status: Extract<ReservationStatus, 'confirmed' | 'cancelled' | 'no_show'>): Promise<Reservation> {
    return this.api.patch<Reservation>(`/reservations/${id}/status`, { status });
  }

  public seat(id: string, tableIds?: string[]): Promise<Reservation> {
    return this.api.post<Reservation>(`/reservations/${id}/seat`, tableIds ? { tableIds } : {});
  }

  public static isValidCode(code: string): boolean {
    return /^RT-[A-Z0-9]{6}$/i.test(code.trim());
  }
}
