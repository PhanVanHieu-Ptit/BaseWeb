import { parseEnv } from './env.schema'

const parsed = parseEnv(import.meta.env)

export const env = {
  appName: parsed.VITE_APP_NAME,
  apiBaseUrl: parsed.VITE_API_BASE_URL,
  apiTimeoutMs: parsed.VITE_API_TIMEOUT_MS,
  // Mocks can never be enabled in a production build, whatever the variable says.
  enableMocks: import.meta.env.DEV && parsed.VITE_ENABLE_MOCKS,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
