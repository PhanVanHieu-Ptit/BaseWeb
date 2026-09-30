import { QueryClient, type UseMutationOptions } from '@tanstack/react-query'

import { isApiError } from '@/lib/api-error'

const MAX_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Client errors (4xx) will fail again: do not retry them.
        const isClientError =
          isApiError(error) &&
          error.status !== undefined &&
          error.status >= 400 &&
          error.status < 500
        return !isClientError && failureCount < MAX_RETRIES
      },
    },
    mutations: {
      retry: false,
    },
  },
})

/** Extra options accepted by a hook built on top of a `queryOptions()` factory. */
export type QueryConfig<T extends (...args: never[]) => unknown> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>

type ApiFnReturnType<T extends (...args: never[]) => Promise<unknown>> = Awaited<ReturnType<T>>

/** Extra options accepted by a mutation hook built on top of an API function. */
export type MutationConfig<T extends (...args: never[]) => Promise<unknown>> = UseMutationOptions<
  ApiFnReturnType<T>,
  Error,
  Parameters<T>[0]
>
