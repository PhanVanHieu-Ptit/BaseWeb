import { STORAGE_KEYS } from '@/config/constants'

export const themes = ['light', 'dark', 'system'] as const
export type Theme = (typeof themes)[number]
export type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME: Theme = 'system'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function isTheme(value: unknown): value is Theme {
  return themes.some((theme) => theme === value)
}

/** Storage can throw (private mode, blocked cookies): theming must keep working without it. */
export function getStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.theme)
    return isTheme(value) ? value : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  } catch {
    // Ignored: the theme still applies for this session.
  }
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

/** Keep the selector in sync with the inline script in `index.html`. */
export function applyTheme(resolved: ResolvedTheme): void {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

/** Subscribes to OS-level changes; returns an unsubscribe function. */
export function watchSystemTheme(onChange: (resolved: ResolvedTheme) => void): () => void {
  const query = window.matchMedia(DARK_QUERY)
  const listener = () => {
    onChange(getSystemTheme())
  }
  query.addEventListener('change', listener)
  return () => {
    query.removeEventListener('change', listener)
  }
}
