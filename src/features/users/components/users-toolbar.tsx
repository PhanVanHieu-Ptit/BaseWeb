import { PlusIcon, SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { userStatusSchema, type UsersParams } from '../types'

interface UsersToolbarProps {
  search: string
  status: UsersParams['status']
  onSearchChange: (value: string) => void
  onStatusChange: (value: UsersParams['status']) => void
  onAdd: () => void
}

const STATUS_OPTIONS = userStatusSchema.options

function isStatusFilter(value: string): value is UsersParams['status'] {
  return value === 'all' || STATUS_OPTIONS.some((option) => option === value)
}

export function UsersToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAdd,
}: UsersToolbarProps) {
  const { t } = useTranslation(['users', 'common'])

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-52 flex-1 sm:max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchLabel')}
          className="pl-9"
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value)
          }}
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) => {
          if (isStatusFilter(value)) onStatusChange(value)
        }}
      >
        <SelectTrigger className="w-44" aria-label={t('filter.label')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filter.all')}</SelectItem>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`status.${option}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button className="ml-auto" onClick={onAdd}>
        <PlusIcon />
        {t('add')}
      </Button>
    </div>
  )
}
