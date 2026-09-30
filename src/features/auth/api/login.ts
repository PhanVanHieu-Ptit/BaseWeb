import { useMutation } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import type { MutationConfig } from '@/lib/react-query'

import { useAuthStore } from '../store/auth.store'
import { loginResponseSchema, type LoginInput, type LoginResponse } from '../types'

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await axiosClient.post<unknown>('/auth/login', input, { skipAuth: true })
  return loginResponseSchema.parse(data)
}

export function useLogin({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof login> } = {}) {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    ...mutationConfig,
    mutationFn: login,
    onSuccess: (data, ...args) => {
      setSession(data)
      mutationConfig?.onSuccess?.(data, ...args)
    },
  })
}
