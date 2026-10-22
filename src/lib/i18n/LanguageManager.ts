import { LANGUAGES, type Language } from '@/domain/models';
import { en } from './dictionaries/en';
import { es, type Dictionary } from './dictionaries/es';

type Listener = () => void;

export class LanguageManager {
  public static readonly DEFAULT_LANGUAGE: Language = 'es';
  private static readonly STORAGE_KEY = 'restotime.language';
  private static readonly DICTIONARIES: Readonly<Record<Language, Dictionary>> = { es, en };
  private static readonly LOCALES: Readonly<Record<Language, string>> = { es: 'es-CO', en: 'en-US' };

  private current: Language = LanguageManager.DEFAULT_LANGUAGE;
  private restored = false;
  private readonly listeners = new Set<Listener>();

  public get language(): Language {
    return this.current;
  }

  public dictionary(language: Language = this.current): Dictionary {
    return LanguageManager.DICTIONARIES[language];
  }

  public locale(language: Language = this.current): string {
    return LanguageManager.LOCALES[language];
  }

  public setLanguage(language: Language): void {
    if (!LanguageManager.isLanguage(language) || language === this.current) return;
    this.current = language;
    this.persist(language);
    this.syncDocument();
    this.emit();
  }

  public restore(): void {
    if (this.restored || typeof window === 'undefined') return;
    this.restored = true;
    try {
      const stored = window.localStorage.getItem(LanguageManager.STORAGE_KEY);
      if (LanguageManager.isLanguage(stored) && stored !== this.current) {
        this.current = stored;
        this.emit();
      }
    } catch {
    }
    this.syncDocument();
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): Language => this.current;

  public getServerSnapshot = (): Language => LanguageManager.DEFAULT_LANGUAGE;

  public static fill(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) =>
      values[key] === undefined ? match : String(values[key]),
    );
  }

  public static isLanguage(value: unknown): value is Language {
    return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
  }

  private persist(language: Language): void {
    try {
      window.localStorage.setItem(LanguageManager.STORAGE_KEY, language);
    } catch {
    }
  }

  private syncDocument(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.current;
    }
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

export const languageManager = new LanguageManager();
