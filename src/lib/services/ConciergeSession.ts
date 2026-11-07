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
