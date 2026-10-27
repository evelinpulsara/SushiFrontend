'use client';

import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';
import { ApiError } from '@/lib/api/ApiClient';

interface ResourceState<T> {
  key: string | null;
  data: T | null;
  error: ApiError | null;
}

export interface Resource<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  reload: () => void;
  replace: (data: T) => void;
}

export function toApiError(error: unknown): ApiError {
  return error instanceof ApiError ? error : new ApiError(0, 'UNKNOWN', error instanceof Error ? error.message : String(error));
}

export function useResource<T>(key: string | null, loader: () => Promise<T>, initialData?: T | null): Resource<T> {
  const initialKey = key !== null && initialData != null ? `${key}#0` : null;
  const [state, setState] = useState<ResourceState<T>>({ key: initialKey, data: initialData ?? null, error: null });
  const [nonce, setNonce] = useState(0);
  const skipKey = useRef<string | null>(initialKey);
  const load = useEffectEvent(loader);
  const requestKey = key === null ? null : `${key}#${nonce}`;

  useEffect(() => {
    if (requestKey === null) return;
    if (requestKey === skipKey.current) {
      skipKey.current = null;
      return;
    }
    let active = true;
    load()
      .then((data) => {
        if (active) setState({ key: requestKey, data, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState((previous) => ({ key: requestKey, data: previous.data, error: toApiError(error) }));
      });
    return () => {
      active = false;
    };
  }, [requestKey]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);
  const replace = useCallback((data: T) => setState((previous) => ({ ...previous, data })), []);

  return {
    data: state.data,
    error: state.error,
    loading: requestKey !== null && state.key !== requestKey,
    reload,
    replace,
  };
}
