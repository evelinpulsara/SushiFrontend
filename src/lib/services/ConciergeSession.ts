import type { Allergen, ConciergeConversation, ConciergeTurn } from '@/domain/models';
import type { ApiClient } from '@/lib/api/ApiClient';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  turn: ConciergeTurn | null;
}

export class ConciergeSession {
  private conversation: ConciergeConversation | null = null;
  private entries: ChatEntry[] = [];
  private sequence = 0;

  public constructor(
    private readonly api: ApiClient,
    private readonly link: { reservationCode: string | null; ticketCode: string | null } = {
      reservationCode: null,
      ticketCode: null,
    },
  ) {}

  public get history(): readonly ChatEntry[] {
    return this.entries;
  }

  public get conversationId(): string | null {
    return this.conversation?.id ?? null;
  }

  public async send(content: string, avoidedAllergens: readonly Allergen[]): Promise<readonly ChatEntry[]> {
    const text = content.trim();
    if (!text) return this.entries;

    this.entries = [...this.entries, { id: this.nextId(), role: 'user', content: text, turn: null }];
    try {
      const conversationId = await this.ensureConversation(avoidedAllergens);
      const turn = await this.api.post<ConciergeTurn>(`/concierge/conversations/${conversationId}/messages`, {
        content: text,
        avoidedAllergens,
      });
      this.conversation = turn.conversation;
      this.entries = [...this.entries, { id: turn.message.id, role: 'assistant', content: turn.message.content, turn }];
      return this.entries;
    } catch (error) {
      this.entries = this.entries.slice(0, -1);
      throw error;
    }
  }

  public reset(): void {
    this.conversation = null;
    this.entries = [];
  }

  private async ensureConversation(avoidedAllergens: readonly Allergen[]): Promise<string> {
    if (!this.conversation) {
      this.conversation = await this.api.post<ConciergeConversation>('/concierge/conversations', {
        avoidedAllergens,
        reservationCode: this.link.reservationCode,
        ticketCode: this.link.ticketCode,
      });
    }
    return this.conversation.id;
  }

  private nextId(): string {
    this.sequence += 1;
    return `local-${this.sequence}`;
  }
}
