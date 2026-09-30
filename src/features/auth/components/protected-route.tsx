import { Navigate, Outlet, useLocation } from 'react-router'

import { paths } from '@/config/paths'

import { useAuth } from '../hooks/use-auth'

/** Layout route: renders its children only for authenticated users. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={paths.login} replace state={{ from }} />
  }

  return <Outlet />
}
