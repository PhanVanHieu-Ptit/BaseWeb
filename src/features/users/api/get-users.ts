import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import type { QueryConfig } from '@/lib/react-query'
import type { PaginatedResponse } from '@/types'

import { usersResponseSchema, type User, type UsersParams } from '../types'

import { usersKeys } from './query-keys'

export async function getUsers(params: UsersParams): Promise<PaginatedResponse<User>> {
  const { status, ...rest } = params
  const { data } = await axiosClient.get<unknown>('/users', {
    params: { ...rest, ...(status === 'all' ? {} : { status }) },
  })
  return usersResponseSchema.parse(data)
}

export const usersQueryOptions = (params: UsersParams) =>
  queryOptions({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
    // Keep the current rows on screen while the next page / filter loads.
    placeholderData: keepPreviousData,
  })

export function useUsers({
  params,
  queryConfig,
}: {
  params: UsersParams
  queryConfig?: QueryConfig<typeof usersQueryOptions>
}) {
  return useQuery({ ...usersQueryOptions(params), ...queryConfig })
}
