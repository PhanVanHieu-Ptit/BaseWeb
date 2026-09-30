import { useTranslation } from 'react-i18next'

import { useAuth } from '@/features/auth'
import { ActivityFeed, StatsGrid } from '@/features/dashboard'

export function Component() {
  const { t } = useTranslation('dashboard')
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {user ? t('welcomeUser', { name: user.name }) : t('welcome')}
        </p>
      </div>
      <StatsGrid />
      <ActivityFeed />
    </div>
  )
}
