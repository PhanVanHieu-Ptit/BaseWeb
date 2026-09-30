import { i18n } from '@/lib/i18n'

/** Intl locale for the active UI language. */
function locale(): string {
  return i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'
}

// Formatting follows the language chosen at call time, so a switch applies on the next render.
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale()).format(value)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat(locale(), { style: 'currency', currency }).format(value)
}

/** `value` is a ratio: 0.034 → "3.4%". */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 1 }).format(
    value,
  )
}

export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat(locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(isoDate),
  )
}
