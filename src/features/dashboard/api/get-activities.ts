import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import type { QueryConfig } from '@/lib/react-query'
import type { PaginatedResponse } from '@/types'

import { activitiesResponseSchema, type Activity, type ActivitiesParams } from '../types'

import { dashboardKeys } from './query-keys'

export async function getActivities(
  params: ActivitiesParams,
): Promise<PaginatedResponse<Activity>> {
  const { data } = await axiosClient.get<unknown>('/dashboard/activities', { params })
  return activitiesResponseSchema.parse(data)
}

export const activitiesQueryOptions = (params: ActivitiesParams) =>
  queryOptions({
    queryKey: dashboardKeys.activities(params),
    queryFn: () => getActivities(params),
    // Keep showing the previous page/search results while the next ones load.
    placeholderData: keepPreviousData,
  })

export function useActivities({
  params,
  queryConfig,
}: {
  params: ActivitiesParams
  queryConfig?: QueryConfig<typeof activitiesQueryOptions>
}) {
  return useQuery({ ...activitiesQueryOptions(params), ...queryConfig })
}
