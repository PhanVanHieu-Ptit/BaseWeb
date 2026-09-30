import { useMutation, useQueryClient } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import { i18n } from '@/lib/i18n'
import { notify } from '@/lib/notify'
import type { MutationConfig } from '@/lib/react-query'

import { usersKeys } from './query-keys'

export async function deleteUser(id: string): Promise<void> {
  await axiosClient.delete(`/users/${id}`)
}

export function useDeleteUser({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof deleteUser> } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    ...mutationConfig,
    mutationFn: deleteUser,
    onSuccess: async (data, ...args) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      notify.success(i18n.t('users:toast.deleted'))
      await mutationConfig?.onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      notify.error(error)
      return mutationConfig?.onError?.(error, ...args)
    },
  })
}
