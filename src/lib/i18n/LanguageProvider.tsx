'use client';

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import type { Language } from '@/domain/models';
import { Formatter } from '@/lib/format/Formatter';
import type { Dictionary } from './dictionaries/es';
import { LanguageManager, languageManager } from './LanguageManager';

export interface LanguageContextValue {
  language: Language;
  t: Dictionary;
  format: Formatter;
  setLanguage: (language: Language) => void;
  fill: (template: string, values: Record<string, string | number>) => string;
  pick: (record: object, base: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    languageManager.subscribe,
    languageManager.getSnapshot,
    languageManager.getServerSnapshot,
  );

  useEffect(() => {
    languageManager.restore();
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      t: languageManager.dictionary(language),
      format: new Formatter(language),
      setLanguage: (next) => languageManager.setLanguage(next),
      fill: (template, values) => LanguageManager.fill(template, values),
      pick: (record, base) => {
        const suffix = language === 'es' ? 'Es' : 'En';
        const localized = (record as Record<string, unknown>)[`${base}${suffix}`];
        return typeof localized === 'string' ? localized : '';
      },
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18n must be used inside <LanguageProvider>');
  }
  return context;
}
