import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import type { ActivityStatus } from '../types'

const STATUS_STYLES: Record<ActivityStatus, string> = {
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
}

interface StatusBadgeProps {
  status: ActivityStatus
  className?: string
}

/** Sample of `cn()`: base classes + a variant + a caller override, merged without conflicts. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation('dashboard')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        STATUS_STYLES[status],
        className,
      )}
    >
      {t(`status.${status}`)}
    </span>
  )
}
