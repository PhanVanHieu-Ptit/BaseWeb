import { useMutation, useQueryClient } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import { i18n } from '@/lib/i18n'
import { notify } from '@/lib/notify'
import type { MutationConfig } from '@/lib/react-query'

import { userSchema, type User, type UserFormInput } from '../types'

import { usersKeys } from './query-keys'

export async function createUser(input: UserFormInput): Promise<User> {
  const { data } = await axiosClient.post<unknown>('/users', input)
  return userSchema.parse(data)
}

export function useCreateUser({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof createUser> } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    ...mutationConfig,
    mutationFn: createUser,
    onSuccess: async (data, ...args) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      notify.success(i18n.t('users:toast.created'))
      await mutationConfig?.onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      notify.error(error)
      return mutationConfig?.onError?.(error, ...args)
    },
  })
}
