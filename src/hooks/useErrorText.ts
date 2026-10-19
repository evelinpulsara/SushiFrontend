'use client';

import type { ApiError } from '@/lib/api/ApiClient';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export function useErrorText(): (error: ApiError | null) => string | null {
  const { t } = useI18n();
  return (error) => {
    if (!error) return null;
    if (error.isNetworkError) return t.errors.network;
    return error.message || t.errors.generic;
  };
}
