import { z } from 'zod'

/**
 * Schema of the client environment. Kept free of `import.meta.env` so it can be shared
 * by the app (runtime validation) and by `vite.config.ts` (validation before dev/build).
 */
export const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1).default('BaseWeb'),
  // Absolute URL, or a path such as `/api` when a reverse proxy is used.
  VITE_API_BASE_URL: z.union([z.url(), z.string().startsWith('/')]),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  VITE_ENABLE_MOCKS: z.stringbool().default(false),
})

export type Env = z.infer<typeof envSchema>

export function parseEnv(source: Record<string, unknown>): Env {
  const result = envSchema.safeParse(source)
  if (!result.success) {
    throw new Error(
      `Invalid environment variables (see .env.example):\n${z.prettifyError(result.error)}`,
    )
  }
  return result.data
}
