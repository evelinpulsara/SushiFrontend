import type { Language } from '@/domain/models';

export class ApiError extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }

  public get isNetworkError(): boolean {
    return this.status === 0;
  }
}

interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

interface ErrorEnvelope {
  success: false;
  error: { code: string; message: string; details?: Record<string, unknown> };
}

type Query = Record<string, string | number | boolean | null | undefined | readonly string[]>;

export class ApiClient {
  public constructor(
    private readonly baseUrl: string,
    private readonly languageOf: () => Language,
    private readonly tokenOf: () => string | null = () => null,
    private readonly onUnauthorized: () => void = () => undefined,
  ) {}

  public get<T>(path: string, query?: Query): Promise<T> {
    return this.request<T>('GET', path, undefined, query);
  }

  public post<T>(path: string, body: unknown = {}): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  public patch<T>(path: string, body: unknown): Promise<T> {
