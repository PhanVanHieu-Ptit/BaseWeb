import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/api-error'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format'

import { useDashboardStats } from '../api/get-stats'

import { StatCard } from './stat-card'

export function StatsGrid() {
  const { t } = useTranslation(['dashboard', 'common'])
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
          {t('common:actions.tryAgain')}
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={t('stats.totalUsers')}
        value={formatNumber(data.totalUsers)}
        description={t('stats.totalUsersHint')}
      />
      <StatCard
        label={t('stats.activeSessions')}
        value={formatNumber(data.activeSessions)}
        description={t('stats.activeSessionsHint')}
      />
      <StatCard
        label={t('stats.revenue')}
        value={formatCurrency(data.revenue)}
        description={t('stats.revenueHint')}
      />
      <StatCard
        label={t('stats.conversionRate')}
        value={formatPercent(data.conversionRate)}
        description={t('stats.conversionRateHint')}
      />
    </div>
  )
}
