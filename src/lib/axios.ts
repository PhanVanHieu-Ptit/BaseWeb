import axios, { isAxiosError } from 'axios'

import { env } from '@/config/env'
import { toApiError } from '@/lib/api-error'

declare module 'axios' {
  // The type parameter must match axios' own declaration for the interfaces to merge.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface AxiosRequestConfig<D = any> {
    /** Skip the Bearer header and the 401 → refresh flow (login, refresh, public endpoints). */
    skipAuth?: boolean
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface InternalAxiosRequestConfig<D = any> {
    /** Set once a request has been replayed after a token refresh, to avoid loops. */
    _retry?: boolean
  }
}

/**
 * What the HTTP client needs from the authentication layer. It is injected (see
 * `configureAuth`) so `lib/` never has to import from `features/`.
 */
export interface AuthHandlers {
  getAccessToken: () => string | null
  /** Resolves with a fresh access token, rejects when the session cannot be renewed. */
  refreshAccessToken: () => Promise<string>
  /** Called when the session is definitely over (refresh failed, or still 401 after refresh). */
  onAuthFailure: () => void
}

let authHandlers: AuthHandlers | undefined

export function configureAuth(handlers: AuthHandlers): void {
  authHandlers = handlers
}

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: { Accept: 'application/json' },
})

// Concurrent 401s share one refresh call.
let refreshPromise: Promise<string> | undefined

function refreshOnce(handlers: AuthHandlers): Promise<string> {
  refreshPromise ??= handlers.refreshAccessToken().finally(() => {
    refreshPromise = undefined
  })
  return refreshPromise
}

axiosClient.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = authHandlers?.getAccessToken()
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

axiosClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!isAxiosError(error)) {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  }

  const config = error.config
  const handlers = authHandlers
  const isUnauthorized = error.response?.status === 401

  if (!isUnauthorized || !config || !handlers || config.skipAuth) {
    return Promise.reject(toApiError(error))
  }

  // Replayed request that is still rejected: the session is over.
  if (config._retry) {
    handlers.onAuthFailure()
    return Promise.reject(toApiError(error))
  }
  config._retry = true

  // The token may already have been refreshed while this request was in flight.
  const currentToken = handlers.getAccessToken()
  const sentWithCurrentToken = config.headers.get('Authorization') === `Bearer ${currentToken}`

  let token: string | null = currentToken
  if (!currentToken || sentWithCurrentToken) {
    try {
      token = await refreshOnce(handlers)
    } catch {
      handlers.onAuthFailure()
      return Promise.reject(toApiError(error))
    }
  }

  config.headers.set('Authorization', `Bearer ${token}`)
  // Failures of the replay go through this interceptor again and are normalised there.
  return axiosClient.request(config)
})
