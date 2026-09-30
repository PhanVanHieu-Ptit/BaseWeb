import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { UserStatus } from '../types'

const STATUS_STYLES: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const { t } = useTranslation(['users', 'common'])

  return <Badge className={cn(STATUS_STYLES[status])}>{t(`status.${status}`)}</Badge>
}
