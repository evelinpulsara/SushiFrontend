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
    return this.request<T>('PATCH', path, body);
  }

  public url(path: string, query?: Query): string {
    const url = new URL(`${this.baseUrl.replace(/\/+$/, '')}${path}`);
    for (const [key, raw] of Object.entries(query ?? {})) {
      if (raw === undefined || raw === null || raw === '') continue;
      const value = Array.isArray(raw) ? raw.join(',') : String(raw);
      if (value !== '') url.searchParams.set(key, value);
    }
    return url.toString();
  }

  private async request<T>(method: string, path: string, body?: unknown, query?: Query): Promise<T> {
    const language = this.languageOf();
    const token = this.tokenOf();
    let response: Response;
    try {
      response = await fetch(this.url(path, query), {
        method,
        headers: {
          Accept: 'application/json',
          'Accept-Language': language,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: 'no-store',
      });
    } catch {
      throw new ApiError(0, 'NETWORK_ERROR', 'Network error');
    }

    let payload: SuccessEnvelope<T> | ErrorEnvelope | null = null;
    try {
      payload = (await response.json()) as SuccessEnvelope<T> | ErrorEnvelope;
    } catch {
      throw new ApiError(response.status, 'INVALID_RESPONSE', `Unexpected response (${response.status})`);
    }

    if (response.status === 401 && token) this.onUnauthorized();
    if (!response.ok || !payload.success) {
      const error = payload.success ? { code: 'UNKNOWN', message: response.statusText } : payload.error;
      throw new ApiError(response.status, error.code, error.message, ('details' in error && error.details) || {});
    }
    return payload.data;
  }
}
