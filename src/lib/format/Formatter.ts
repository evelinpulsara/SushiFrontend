import type { Language } from '@/domain/models';

export class Formatter {
  private readonly money: Intl.NumberFormat;
  private readonly time: Intl.DateTimeFormat;
  private readonly dateLong: Intl.DateTimeFormat;
  private readonly dateShort: Intl.DateTimeFormat;
  private readonly month: Intl.DateTimeFormat;
  private readonly percent: Intl.NumberFormat;

  public constructor(
    private readonly language: Language,
    private readonly timezone = 'America/Bogota',
    currency = 'COP',
  ) {
    const locale = language === 'es' ? 'es-CO' : 'en-US';
    this.money = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
    this.time = new Intl.DateTimeFormat(locale, { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: language === 'en' });
    this.dateLong = new Intl.DateTimeFormat(locale, { timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long' });
    this.dateShort = new Intl.DateTimeFormat(locale, { timeZone: 'UTC', day: 'numeric', month: 'short' });
    this.month = new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: 'short' });
    this.percent = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  }

  public currency(amount: number): string {
    return this.money.format(amount);
  }

  public clock(iso: string | Date): string {
    return this.time.format(typeof iso === 'string' ? new Date(iso) : iso);
  }

  public longDate(iso: string | Date): string {
    const text = this.dateLong.format(typeof iso === 'string' ? new Date(iso) : iso);
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  public shortLocalDate(localDate: string): string {
    return this.dateShort.format(new Date(`${localDate}T12:00:00Z`));
  }

  public monthOf(localDate: string): string {
    return this.month.format(new Date(`${localDate}T12:00:00Z`)).replace('.', '');
  }

  public localTime(hhmm: string): string {
    if (this.language === 'es') return hhmm;
    const [hours = 0, minutes = 0] = hhmm.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const twelve = hours % 12 === 0 ? 12 : hours % 12;
    return `${twelve}:${String(minutes).padStart(2, '0')} ${suffix}`;
  }

  public number(value: number): string {
    return this.percent.format(value);
  }

  public get zone(): string {
    return this.timezone;
  }
}
