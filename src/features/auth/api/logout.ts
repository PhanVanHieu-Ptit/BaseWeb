import { useMutation } from '@tanstack/react-query'

import { axiosClient } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

import { useAuthStore } from '../store/auth.store'

export async function logout(): Promise<void> {
  await axiosClient.post('/auth/logout')
}

/** Ends the session locally whatever the server answers; route guards then redirect to /login. */
export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession()
      queryClient.clear()
    },
  })
}
