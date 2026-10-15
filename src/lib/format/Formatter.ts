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
