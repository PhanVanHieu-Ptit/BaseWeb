import { Outlet } from 'react-router'

import logoUrl from '@/assets/logo.svg'
import { env } from '@/config/env'

/** Centered shell for public pages (login…). */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <img src={logoUrl} alt="" className="size-8" />
        {env.appName}
      </div>
      <main className="w-full max-w-sm">
        <Outlet />
      </main>
    </div>
  )
}
