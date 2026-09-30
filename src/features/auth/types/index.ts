import { z } from 'zod'

import { i18n } from '@/lib/i18n'

export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
})
export type AuthUser = z.infer<typeof authUserSchema>

/** Form input. Password rules belong to sign-up, so login only requires a value. */
export const loginSchema = z.object({
  email: z.email({ error: () => i18n.t('auth:validation.email') }),
  password: z.string().min(1, { error: () => i18n.t('auth:validation.passwordRequired') }),
})
export type LoginInput = z.infer<typeof loginSchema>

/** POST /auth/login → 200 */
export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: authUserSchema,
})
export type LoginResponse = z.infer<typeof loginResponseSchema>

/** POST /auth/refresh → 200. `refreshToken` is only present when the backend rotates it. */
export const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1).optional(),
})
export type RefreshResponse = z.infer<typeof refreshResponseSchema>
