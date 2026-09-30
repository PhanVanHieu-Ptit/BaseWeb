import { axiosClient } from '@/lib/axios'

import { refreshResponseSchema, type RefreshResponse } from '../types'

export async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await axiosClient.post<unknown>(
    '/auth/refresh',
    { refreshToken },
    { skipAuth: true },
  )
  return refreshResponseSchema.parse(data)
}
