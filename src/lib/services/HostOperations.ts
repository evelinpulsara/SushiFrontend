import type { AIAccuracy, DashboardOverview, DiningTable, LiveKpis, TableStatus } from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';

const MANUAL_TRANSITIONS: Readonly<Record<TableStatus, readonly TableStatus[]>> = {
  available: ['reserved'],
  reserved: ['available'],
  occupied: ['clearing_soon'],
  clearing_soon: ['occupied'],
};

export class HostOperations {
  public constructor(private readonly api: ApiClient) {}

  public getOverview(): Promise<DashboardOverview> {
    return this.api.get<DashboardOverview>('/dashboard/overview');
  }

  public getKpis(): Promise<LiveKpis> {
    return this.api.get<LiveKpis>('/dashboard/kpis');
  }

  public getAIAccuracy(): Promise<AIAccuracy> {
    return this.api.get<AIAccuracy>('/dashboard/ai-accuracy');
  }

  public updateTableStatus(tableId: string, status: TableStatus): Promise<DiningTable> {
    return this.api.patch<DiningTable>(`/tables/${tableId}/status`, { status });
  }

  public seatWalkIn(input: { tableIds: string[]; guestName: string; partySize: number }): Promise<unknown> {
    return this.api.post('/seatings', input);
  }

  public releaseSeating(seatingId: string): Promise<unknown> {
    return this.api.post(`/seatings/${seatingId}/release`);
  }

  public allowedTransitions(table: DiningTable): readonly TableStatus[] {
    return MANUAL_TRANSITIONS[table.status];
  }

  public freeTables(tables: readonly DiningTable[]): DiningTable[] {
    return tables
      .filter((table) => table.isActive && table.status === 'available')
      .sort((a, b) => a.capacity - b.capacity || a.code.localeCompare(b.code));
  }
}
