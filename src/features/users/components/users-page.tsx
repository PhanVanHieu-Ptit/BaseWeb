import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import { getErrorMessage } from '@/lib/api-error'

import { useUsers } from '../api/get-users'
import type { User, UsersParams } from '../types'

import { DeleteUserDialog } from './delete-user-dialog'
import { UserFormDialog } from './user-form-dialog'
import { UsersTable } from './users-table'
import { UsersToolbar } from './users-toolbar'

const PAGE_SIZE = 8

export function UsersPage() {
  const { t } = useTranslation(['users', 'common'])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<UsersParams['status']>('all')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  // The request only fires once the user pauses typing.
  const debouncedSearch = useDebounce(search.trim(), 300)

  const { data, isPending, isError, error, isPlaceholderData, refetch } = useUsers({
    params: { search: debouncedSearch, status, page, pageSize: PAGE_SIZE },
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  function openForm(user?: User) {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('users:title')}</h1>
        <p className="text-muted-foreground">{t('users:description')}</p>
      </div>

      <UsersToolbar
        search={search}
        status={status}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onStatusChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
        onAdd={() => {
          openForm()
        }}
      />

      {isPending && (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <Skeleton key={index} className="h-12" />
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
          <p className="rounded-md border py-10 text-center text-sm text-muted-foreground">
            {t('users:empty')}
          </p>
        ) : (
          <UsersTable
            users={data.items}
            isStale={isPlaceholderData}
            onEdit={openForm}
            onDelete={setDeletingUser}
          />
        ))}

      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('common:pagination.pageOf', { page, total: totalPages })} ·{' '}
            {t('users:total', { count: data.total })}
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

      <UserFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} user={editingUser} />
      <DeleteUserDialog
        user={deletingUser}
        onClose={() => {
          setDeletingUser(null)
        }}
      />
    </div>
  )
}
