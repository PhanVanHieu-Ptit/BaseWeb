import { useMutation, useQueryClient } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import { i18n } from '@/lib/i18n'
import { notify } from '@/lib/notify'
import type { MutationConfig } from '@/lib/react-query'

import { userSchema, type User, type UserFormInput } from '../types'

import { usersKeys } from './query-keys'

export async function updateUser({ id, ...input }: UserFormInput & { id: string }): Promise<User> {
  const { data } = await axiosClient.patch<unknown>(`/users/${id}`, input)
  return userSchema.parse(data)
}

export function useUpdateUser({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof updateUser> } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    ...mutationConfig,
    mutationFn: updateUser,
    onSuccess: async (data, ...args) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      notify.success(i18n.t('users:toast.updated'))
      await mutationConfig?.onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      notify.error(error)
      return mutationConfig?.onError?.(error, ...args)
    },
  })
}
