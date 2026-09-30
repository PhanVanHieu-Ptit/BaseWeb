// Public API of the dashboard feature: import from '@/features/dashboard', never from deeper paths.
export { ActivityFeed } from './components/activity-feed'
export { StatsGrid } from './components/stats-grid'
export type { Activity, ActivityStatus, DashboardStats } from './types'
