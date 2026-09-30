const LOCALE = 'en-US'

const numberFormatter = new Intl.NumberFormat(LOCALE)
const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 1,
})
const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).format(value)
}

/** `value` is a ratio: 0.034 → "3.4%". */
export function formatPercent(value: number): string {
  return percentFormatter.format(value)
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate))
}
