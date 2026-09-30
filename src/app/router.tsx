import { createBrowserRouter, Navigate } from 'react-router'

import { PageLoader } from '@/components/page-loader'
import { paths } from '@/config/paths'
import { ProtectedRoute, PublicRoute } from '@/features/auth'

import { AuthLayout } from './layouts/auth-layout'
import { MainLayout } from './layouts/main-layout'
import { RouteErrorBoundary } from './route-error-boundary'

// Page modules are loaded on demand: each one exports a `Component`.
export const router = createBrowserRouter([
  {
    path: paths.root,
    ErrorBoundary: RouteErrorBoundary,
    // Shown while the first lazy route module is loading.
    HydrateFallback: PageLoader,
    children: [
      // Guests only (a signed-in user is redirected away).
      {
        Component: PublicRoute,
        children: [
          {
            Component: AuthLayout,
            children: [{ path: paths.login, lazy: () => import('./routes/login') }],
          },
        ],
      },
      // Signed-in users only (a guest is redirected to /login).
      {
        Component: ProtectedRoute,
        children: [
          {
            Component: MainLayout,
            children: [
              { index: true, element: <Navigate to={paths.dashboard} replace /> },
              { path: paths.dashboard, lazy: () => import('./routes/dashboard') },
            ],
          },
        ],
      },
      { path: '*', lazy: () => import('./routes/not-found') },
    ],
  },
])
