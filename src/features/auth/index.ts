// Public API of the auth feature: import from '@/features/auth', never from deeper paths.
export { useLogout } from './api/logout'
export { LoginForm } from './components/login-form'
export { ProtectedRoute } from './components/protected-route'
export { PublicRoute } from './components/public-route'
export { useAuth } from './hooks/use-auth'
export { setupAuth } from './setup'
export type { AuthUser } from './types'
