import { useTranslation } from 'react-i18next'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { useDeleteUser } from '../api/delete-user'
import type { User } from '../types'

interface DeleteUserDialogProps {
  /** The user awaiting confirmation; `null` keeps the dialog closed. */
  user: User | null
  onClose: () => void
}

export function DeleteUserDialog({ user, onClose }: DeleteUserDialogProps) {
  const { t } = useTranslation(['users', 'common'])
  const deleteUser = useDeleteUser({ mutationConfig: { onSuccess: onClose } })

  return (
    <AlertDialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open && !deleteUser.isPending) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('delete.description', { name: user?.name ?? '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUser.isPending}>
            {t('common:actions.cancel')}
          </AlertDialogCancel>
          {/* A plain Button (not AlertDialogAction) keeps the dialog open until the request ends. */}
          <Button
            variant="destructive"
            disabled={deleteUser.isPending}
            onClick={() => {
              if (user) deleteUser.mutate(user.id)
            }}
          >
            {deleteUser.isPending && <Spinner />}
            {t('delete.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
