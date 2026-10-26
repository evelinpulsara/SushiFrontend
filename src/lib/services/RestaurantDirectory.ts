import type { RestaurantInfo, ServiceHour, Zone } from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';

export interface ServiceDay {
  date: string;
  dayOfWeek: number;
  isOpen: boolean;
  isToday: boolean;
}

export class RestaurantDirectory {
  private cached: Promise<RestaurantInfo> | null = null;

  public constructor(private readonly api: ApiClient) {}

  public getInfo(): Promise<RestaurantInfo> {
    if (!this.cached) {
      this.cached = this.api.get<RestaurantInfo>('/restaurant').catch((error: unknown) => {
        this.cached = null;
        throw error;
      });
    }
    return this.cached;
  }

  public async listZones(): Promise<Zone[]> {
    return (await this.getInfo()).zones;
  }

  public upcomingDays(info: RestaurantInfo, count: number): ServiceDay[] {
    const [year, month, day] = info.localNow.date.split('-').map(Number);
    return Array.from({ length: count }, (_, offset) => {
      const date = new Date(Date.UTC(year!, month! - 1, day! + offset));
      const dayOfWeek = date.getUTCDay();
      return {
        date: date.toISOString().slice(0, 10),
        dayOfWeek,
        isOpen: info.serviceHours.some((hour) => hour.dayOfWeek === dayOfWeek),
        isToday: offset === 0,
      };
    });
  }

  public timeSlots(info: RestaurantInfo, day: ServiceDay): Array<{ shift: ServiceHour['shift']; times: string[] }> {
    const step = info.settings.reservationSlotMinutes;
    const nowMinutes = day.isToday ? this.toMinutes(info.localNow.time) + 15 : -1;

    return info.serviceHours
      .filter((hour) => hour.dayOfWeek === day.dayOfWeek)
      .sort((a, b) => a.opensAt.localeCompare(b.opensAt))
      .map((hour) => {
        const times: string[] = [];
        for (let minutes = this.toMinutes(hour.opensAt); minutes <= this.toMinutes(hour.lastSeatingAt); minutes += step) {
          if (minutes > nowMinutes) times.push(this.toClock(minutes));
        }
        return { shift: hour.shift, times };
      })
      .filter((group) => group.times.length > 0);
  }

  private toMinutes(clock: string): number {
    const [hours = 0, minutes = 0] = clock.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private toClock(totalMinutes: number): string {
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
  }
}
