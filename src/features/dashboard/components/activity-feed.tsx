import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import { getErrorMessage } from '@/lib/api-error'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/utils/format'

import { useActivities } from '../api/get-activities'

import { StatusBadge } from './status-badge'

const PAGE_SIZE = 5

export function ActivityFeed() {
  const { t } = useTranslation(['dashboard', 'common'])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  // The request only fires once the user pauses typing.
  const debouncedSearch = useDebounce(search.trim(), 300)

  const { data, isPending, isError, error, isPlaceholderData, refetch } = useActivities({
    params: { search: debouncedSearch, page, pageSize: PAGE_SIZE },
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('activity.title')}</CardTitle>
        <CardDescription>{t('activity.description')}</CardDescription>
        <div className="relative pt-2">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 mt-1 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('activity.searchPlaceholder')}
            aria-label={t('activity.searchLabel')}
            className="pl-9"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isPending && (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <Skeleton key={index} className="h-10" />
            ))}
          </div>
        )}

        {isError && (
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
        )}

        {data &&
          (data.items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t('activity.empty')}</p>
          ) : (
            <ul
              className={cn('divide-y transition-opacity', isPlaceholderData && 'opacity-60')}
              aria-busy={isPlaceholderData}
            >
              {data.items.map((activity) => (
                <li
                  key={activity.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <time dateTime={activity.createdAt} className="text-muted-foreground">
                      {formatDateTime(activity.createdAt)}
                    </time>
                    <StatusBadge status={activity.status} />
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {data && data.total > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('common:pagination.pageOf', { page, total: totalPages })}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  setPage((current) => current - 1)
                }}
              >
                {t('common:actions.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isPlaceholderData}
                onClick={() => {
                  setPage((current) => current + 1)
                }}
              >
                {t('common:actions.next')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
