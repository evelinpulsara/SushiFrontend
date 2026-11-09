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
