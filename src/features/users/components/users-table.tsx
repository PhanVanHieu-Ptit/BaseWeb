import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table'
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/utils/format'

import type { User } from '../types'

import { UserStatusBadge } from './user-status-badge'

// No client-side features: paging, search and filtering all happen on the server.
const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, User>()

interface UsersTableProps {
  users: User[]
  /** Dims the rows while a new page / filter is loading. */
  isStale: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ users, isStale, onEdit, onDelete }: UsersTableProps) {
  const { t } = useTranslation(['users', 'common'])

  // Columns depend on `t`, so they are rebuilt when the language changes.
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
          header: t('columns.name'),
          cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('email', {
          header: t('columns.email'),
          cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
        }),
        columnHelper.accessor('role', {
          header: t('columns.role'),
          cell: (info) => t(`role.${info.getValue()}`),
        }),
        columnHelper.accessor('status', {
          header: t('columns.status'),
          cell: (info) => <UserStatusBadge status={info.getValue()} />,
        }),
        columnHelper.accessor('createdAt', {
          header: t('columns.createdAt'),
          cell: (info) => formatDateTime(info.getValue()),
        }),
        columnHelper.display({
          id: 'actions',
          header: () => <span className="sr-only">{t('columns.actions')}</span>,
          cell: ({ row }) => (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t('rowActions', { name: row.original.name })}
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      onEdit(row.original)
                    }}
                  >
                    <PencilIcon />
                    {t('common:actions.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                      onDelete(row.original)
                    }}
                  >
                    <Trash2Icon />
                    {t('common:actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
      ]),
    [t, onEdit, onDelete],
  )

  const table = useTable({ features, columns, data: users })

  return (
    <div className={cn('rounded-md border transition-opacity', isStale && 'opacity-60')}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
