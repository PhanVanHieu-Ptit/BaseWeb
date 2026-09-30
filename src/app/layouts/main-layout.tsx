import { LogOutIcon } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'

import logoUrl from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'
import { env } from '@/config/env'
import { paths } from '@/config/paths'
import { useAuth, useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'

/** Shell for authenticated pages: header with navigation and the current user. */
export function MainLayout() {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link to={paths.dashboard} className="flex items-center gap-2 font-semibold">
              <img src={logoUrl} alt="" className="size-6" />
              {env.appName}
            </Link>
            <nav aria-label="Main">
              <NavLink
                to={paths.dashboard}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors hover:text-foreground',
                    isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                  )
                }
              >
                Dashboard
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={logout.isPending}
              onClick={() => {
                logout.mutate()
              }}
            >
              <LogOutIcon />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
