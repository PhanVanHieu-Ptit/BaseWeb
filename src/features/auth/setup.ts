import { STORAGE_KEYS } from '@/config/constants'
import { configureAuth } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

import { refreshTokens } from './api/refresh'
import { useAuthStore } from './store/auth.store'

/**
 * Plugs the auth store into the HTTP client and keeps tabs in sync.
 * Call once, before the first render.
 */
export function setupAuth(): void {
  configureAuth({
    getAccessToken: () => useAuthStore.getState().accessToken,
    refreshAccessToken: async () => {
      const { refreshToken, setTokens } = useAuthStore.getState()
      if (!refreshToken) throw new Error('No refresh token available')

      const tokens = await refreshTokens(refreshToken)
      setTokens(tokens)
      return tokens.accessToken
    },
    onAuthFailure: () => {
      useAuthStore.getState().clearSession()
      queryClient.clear()
    },
  })

  // Login / logout / token rotation in another tab.
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEYS.auth) return

    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      if (!useAuthStore.getState().accessToken) queryClient.clear()
    })
  })
}
