import type {
  JoinedWaitlist,
  NewWaitlistEntry,
  SeatSuggestion,
  WaitEstimate,
  WaitEstimateRequest,
  WaitlistEntry,
  WaitlistStatus,
} from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';

export class WaitlistManager {
  public cancelTicket(ticketCode: string): Promise<WaitlistEntry> {
    return this.api.post<WaitlistEntry>(`/waitlist/ticket/${encodeURIComponent(ticketCode.trim().toUpperCase())}/cancel`);
  }

  public constructor(private readonly api: ApiClient) {}

  public estimate(request: WaitEstimateRequest): Promise<WaitEstimate> {
    return this.api.post<WaitEstimate>('/ai/wait-estimate', request);
  }

  public join(entry: NewWaitlistEntry): Promise<JoinedWaitlist> {
    return this.api.post<JoinedWaitlist>('/waitlist', entry);
  }

  public listQueue(): Promise<WaitlistEntry[]> {
    return this.api.get<WaitlistEntry[]>('/waitlist');
  }

  public getTicket(ticketCode: string): Promise<WaitlistEntry> {
    return this.api.get<WaitlistEntry>(`/waitlist/ticket/${encodeURIComponent(ticketCode.trim().toUpperCase())}`);
  }

  public reEstimate(id: string): Promise<JoinedWaitlist> {
    return this.api.post<JoinedWaitlist>(`/waitlist/${id}/re-estimate`);
  }

  public updateStatus(id: string, status: Extract<WaitlistStatus, 'notified' | 'cancelled' | 'no_show'>): Promise<WaitlistEntry> {
    return this.api.patch<WaitlistEntry>(`/waitlist/${id}/status`, { status });
  }

  public seat(id: string, tableIds: string[]): Promise<WaitlistEntry> {
    return this.api.post<WaitlistEntry>(`/waitlist/${id}/seat`, { tableIds });
  }

  public suggestForTable(tableId: string): Promise<SeatSuggestion> {
    return this.api.post<SeatSuggestion>('/ai/seat-suggestion', { tableId });
  }

  public static isValidTicket(code: string): boolean {
    return /^WL-[A-Z0-9]{4}$/i.test(code.trim());
  }
}
