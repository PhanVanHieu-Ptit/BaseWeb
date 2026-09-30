import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { STORAGE_KEYS } from '@/config/constants'
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  storeTheme,
  watchSystemTheme,
  type ResolvedTheme,
  type Theme,
} from '@/lib/theme'

import { ThemeContext, type ThemeContextValue } from './theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => resolveTheme('system'))

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => watchSystemTheme(setSystemTheme), [])

  // Keep several tabs in agreement.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.theme) setThemeState(getStoredTheme())
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next) => {
        storeTheme(next)
        setThemeState(next)
      },
    }),
    [theme, resolvedTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
