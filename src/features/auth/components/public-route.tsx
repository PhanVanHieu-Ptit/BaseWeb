import { Navigate, Outlet, useLocation } from 'react-router'

import { paths } from '@/config/paths'
import { getRedirectPath } from '@/utils/redirect'

import { useAuth } from '../hooks/use-auth'

/** Layout route for guests only (e.g. /login): signed-in users are sent back where they came from. */
export function PublicRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location.state, paths.dashboard)} replace />
  }

  return <Outlet />
}
