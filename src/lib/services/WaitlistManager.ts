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
