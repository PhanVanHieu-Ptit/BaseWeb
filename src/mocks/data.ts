import type { Activity, ActivityStatus, DashboardStats } from '@/features/dashboard'
import type { User, UserRole, UserStatus } from '@/features/users'

const USERS = [
  'Alice Nguyen',
  'Bao Tran',
  'Chi Le',
  'Dung Pham',
  'Emma Wilson',
  'Farid Khan',
] as const
const ACTIONS = [
  'signed in',
  'updated their profile',
  'created a project',
  'exported a report',
  'changed their password',
  'invited a teammate',
] as const
const STATUSES: readonly ActivityStatus[] = ['success', 'success', 'pending', 'success', 'failed']

const START = Date.UTC(2026, 8, 1, 9, 0, 0)
const STEP_MS = 37 * 60 * 1000

function pick<T>(items: readonly [T, ...T[]], index: number): T {
  return items[index % items.length] ?? items[0]
}

/** Deterministic sample data, newest first. */
export const activities: Activity[] = Array.from({ length: 42 }, (_, index) => ({
  id: `activity-${String(index + 1)}`,
  user: pick(USERS, index),
  action: pick(ACTIONS, index * 5 + 1),
  status: STATUSES[index % STATUSES.length] ?? 'success',
  createdAt: new Date(START - index * STEP_MS).toISOString(),
}))

export const stats: DashboardStats = {
  totalUsers: 12_840,
  activeSessions: 342,
  revenue: 48_250.5,
  conversionRate: 0.0342,
}

const USER_NAMES = [
  'Alice Nguyen',
  'Bao Tran',
  'Chi Le',
  'Dung Pham',
  'Emma Wilson',
  'Farid Khan',
  'Giang Vo',
  'Hana Sato',
  'Ivan Petrov',
  'Julia Costa',
] as const
const USER_ROLES: readonly UserRole[] = ['viewer', 'editor', 'viewer', 'admin', 'viewer']
const USER_STATUSES: readonly UserStatus[] = ['active', 'active', 'pending', 'active', 'inactive']

function toEmail(name: string, index: number): string {
  return `${name.toLowerCase().replace(/\s+/g, '.')}.${String(index + 1)}@example.com`
}

/** Mutable on purpose: the users handlers create, edit and delete entries in memory. */
export const users: User[] = Array.from({ length: 27 }, (_, index) => {
  const name = pick(USER_NAMES, index)
  return {
    id: `user-${String(index + 1)}`,
    name,
    email: toEmail(name, index),
    role: USER_ROLES[index % USER_ROLES.length] ?? 'viewer',
    status: USER_STATUSES[index % USER_STATUSES.length] ?? 'active',
    createdAt: new Date(START - index * 24 * 60 * 60 * 1000).toISOString(),
  }
})
