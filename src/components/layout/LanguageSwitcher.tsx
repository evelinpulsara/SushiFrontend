'use client';

import { LANGUAGES } from '@/domain/models';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <div role="group" aria-label={t.nav.language} className={`relative inline-flex rounded-full border border-line-strong bg-ink-soft p-0.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-torii transition-transform duration-300 ${
          language === 'en' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'
        }`}
      />
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
          className={`relative z-10 w-10 rounded-full py-1 text-xs font-semibold tracking-widest transition-colors ${
            language === code ? 'text-ivory' : 'text-mist hover:text-ivory'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
