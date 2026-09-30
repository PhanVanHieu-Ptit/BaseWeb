import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/config/constants'

import type { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setSession: (session: { user: AuthUser; accessToken: string; refreshToken: string }) => void
  /** Stores refreshed tokens. Keeps the current refresh token when the backend does not rotate it. */
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => void
  clearSession: () => void
}

/**
 * Session state, persisted in localStorage (synchronous hydration: no flash on reload).
 * Note: tokens in localStorage are readable by any script running on the page (XSS). If your
 * backend supports it, prefer an httpOnly refresh-token cookie and keep only the access token here.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken })
      },
      setTokens: ({ accessToken, refreshToken }) => {
        set((state) => ({ accessToken, refreshToken: refreshToken ?? state.refreshToken }))
      },
      // Writes nulls (instead of removing the key) so other tabs receive a `storage` event.
      clearSession: () => {
        set({ user: null, accessToken: null, refreshToken: null })
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      partialize: ({ user, accessToken, refreshToken }) => ({ user, accessToken, refreshToken }),
    },
  ),
)
