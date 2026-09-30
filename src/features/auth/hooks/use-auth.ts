import { useShallow } from 'zustand/react/shallow'

import { useAuthStore } from '../store/auth.store'

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.accessToken !== null,
    })),
  )
}
