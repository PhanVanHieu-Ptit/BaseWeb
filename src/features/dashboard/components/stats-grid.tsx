import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/api-error'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format'

import { useDashboardStats } from '../api/get-stats'

import { StatCard } from './stat-card'

export function StatsGrid() {
  const { data, isPending, isError, error, refetch } = useDashboardStats()

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-wrap items-center gap-3 text-sm">
        <p className="text-destructive">{getErrorMessage(error)}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void refetch()
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total users" value={formatNumber(data.totalUsers)} description="All time" />
      <StatCard
        label="Active sessions"
        value={formatNumber(data.activeSessions)}
        description="Right now"
      />
      <StatCard label="Revenue" value={formatCurrency(data.revenue)} description="This month" />
      <StatCard
        label="Conversion rate"
        value={formatPercent(data.conversionRate)}
        description="Visitors who signed up"
      />
    </div>
  )
}
