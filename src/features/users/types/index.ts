import { z } from 'zod'

import { i18n } from '@/lib/i18n'
import type { PaginatedResponse, PaginationParams } from '@/types'

export const userStatusSchema = z.enum(['active', 'inactive', 'pending'])
export type UserStatus = z.infer<typeof userStatusSchema>

export const userRoleSchema = z.enum(['admin', 'editor', 'viewer'])
export type UserRole = z.infer<typeof userRoleSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.iso.datetime(),
})
export type User = z.infer<typeof userSchema>

/** GET /users?search=&status=&page=&pageSize= → 200 */
export const usersResponseSchema = z.object({
  items: z.array(userSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
}) satisfies z.ZodType<PaginatedResponse<User>>

export interface UsersParams extends PaginationParams {
  search: string
  /** `all` means no status filter. */
  status: UserStatus | 'all'
}

/** Create / edit form. Messages resolve at validation time so they follow the active language. */
export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: () => i18n.t('users:validation.nameRequired') })
    .max(60, { error: () => i18n.t('users:validation.nameMax') }),
  email: z.email({ error: () => i18n.t('users:validation.email') }),
  role: userRoleSchema,
  status: userStatusSchema,
})
export type UserFormInput = z.infer<typeof userFormSchema>
