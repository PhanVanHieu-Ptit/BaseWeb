import { LayoutDashboardIcon, SettingsIcon, UsersIcon, type LucideIcon } from 'lucide-react'

import { paths } from '@/config/paths'

export interface NavItem {
  to: string
  /** Key in the `common` namespace. */
  labelKey: 'nav.dashboard' | 'nav.users' | 'nav.settings'
  icon: LucideIcon
}

export const navItems: readonly NavItem[] = [
  { to: paths.dashboard, labelKey: 'nav.dashboard', icon: LayoutDashboardIcon },
  { to: paths.users, labelKey: 'nav.users', icon: UsersIcon },
  { to: paths.settings, labelKey: 'nav.settings', icon: SettingsIcon },
]
