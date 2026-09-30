import { LogOutIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router'

import logoUrl from '@/assets/logo.svg'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { env } from '@/config/env'
import { navItems } from '@/config/nav'
import { paths } from '@/config/paths'
import { useAuth, useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'

/** Shell for authenticated pages: header with navigation, preferences and the current user. */
export function MainLayout() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-6">
            <Link to={paths.dashboard} className="flex shrink-0 items-center gap-2 font-semibold">
              <img src={logoUrl} alt="" className="size-6" />
              <span className="hidden sm:inline">{env.appName}</span>
            </Link>
            <nav aria-label={t('nav.main')} className="flex items-center gap-4">
              {navItems.map(({ to, labelKey, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={t(labelKey)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 text-sm transition-colors hover:text-foreground',
                      isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )
                  }
                >
                  <Icon className="size-4 sm:hidden" />
                  <span className="hidden sm:inline">{t(labelKey)}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">{user?.name}</span>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              disabled={logout.isPending}
              aria-label={t('actions.signOut')}
              onClick={() => {
                logout.mutate()
              }}
            >
              <LogOutIcon />
              <span className="hidden sm:inline">{t('actions.signOut')}</span>
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
