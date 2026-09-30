import { z } from 'zod'

import type { PaginatedResponse, PaginationParams } from '@/types'

/** GET /dashboard/stats → 200 */
export const dashboardStatsSchema = z.object({
  totalUsers: z.number(),
  activeSessions: z.number(),
  revenue: z.number(),
  /** Ratio between 0 and 1. */
  conversionRate: z.number(),
})
export type DashboardStats = z.infer<typeof dashboardStatsSchema>

export const activityStatusSchema = z.enum(['success', 'pending', 'failed'])
export type ActivityStatus = z.infer<typeof activityStatusSchema>

export const activitySchema = z.object({
  id: z.string(),
  user: z.string(),
  action: z.string(),
  status: activityStatusSchema,
  createdAt: z.iso.datetime(),
})
export type Activity = z.infer<typeof activitySchema>

/** GET /dashboard/activities?search=&page=&pageSize= → 200 */
export const activitiesResponseSchema = z.object({
  items: z.array(activitySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
}) satisfies z.ZodType<PaginatedResponse<Activity>>

export interface ActivitiesParams extends PaginationParams {
  search: string
}
