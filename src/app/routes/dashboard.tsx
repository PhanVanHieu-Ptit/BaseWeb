import { ActivityFeed, StatsGrid } from '@/features/dashboard'
import { useAuth } from '@/features/auth'

export function Component() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back{user ? `, ${user.name}` : ''}.</p>
      </div>
      <StatsGrid />
      <ActivityFeed />
    </div>
  )
}
