import { createContext } from 'react'

import type { ResolvedTheme, Theme } from '@/lib/theme'

export interface ThemeContextValue {
  /** The user's choice, including `system`. */
  theme: Theme
  /** What is actually applied: never `system`. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
