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
