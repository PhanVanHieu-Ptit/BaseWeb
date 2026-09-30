import { queryOptions, useQuery } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import type { QueryConfig } from '@/lib/react-query'

import { dashboardStatsSchema, type DashboardStats } from '../types'

import { dashboardKeys } from './query-keys'

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosClient.get<unknown>('/dashboard/stats')
  return dashboardStatsSchema.parse(data)
}

export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  })

export function useDashboardStats({
  queryConfig,
}: { queryConfig?: QueryConfig<typeof dashboardStatsQueryOptions> } = {}) {
  return useQuery({ ...dashboardStatsQueryOptions(), ...queryConfig })
}
