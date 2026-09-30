import type { ActivitiesParams } from '../types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activities: (params: ActivitiesParams) => [...dashboardKeys.all, 'activities', params] as const,
}
