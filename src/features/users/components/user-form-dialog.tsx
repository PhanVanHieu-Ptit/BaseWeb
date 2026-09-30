import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { useCreateUser } from '../api/create-user'
import { useUpdateUser } from '../api/update-user'
import {
  userFormSchema,
  userRoleSchema,
  userStatusSchema,
  type User,
  type UserFormInput,
} from '../types'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present → edit mode; absent → create mode. */
  user?: User | undefined
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The content unmounts on close, so the form always starts from fresh defaults. */}
      <DialogContent>
        <UserForm
          user={user}
          onDone={() => {
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function UserForm({ user, onDone }: { user?: User | undefined; onDone: () => void }) {
  const { t } = useTranslation(['users', 'common'])
  const isEdit = user !== undefined
  const createUser = useCreateUser({ mutationConfig: { onSuccess: onDone } })
  const updateUser = useUpdateUser({ mutationConfig: { onSuccess: onDone } })
  const isPending = createUser.isPending || updateUser.isPending

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'viewer',
      status: user?.status ?? 'active',
    },
  })

  function onSubmit(values: UserFormInput) {
    if (user) updateUser.mutate({ ...values, id: user.id })
    else createUser.mutate(values)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? t('form.editTitle') : t('form.createTitle')}</DialogTitle>
        <DialogDescription>
          {isEdit ? t('form.editDescription') : t('form.createDescription')}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
        className="space-y-4"
      >
        <FormField id="user-name" label={t('form.name')} error={errors.name?.message}>
          {(field) => <Input autoComplete="off" {...field} {...register('name')} />}
        </FormField>

        <FormField id="user-email" label={t('form.email')} error={errors.email?.message}>
          {(field) => <Input type="email" autoComplete="off" {...field} {...register('email')} />}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="user-role" label={t('form.role')} error={errors.role?.message}>
            {(field) => (
              <Controller
                control={control}
                name="role"
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger {...field} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoleSchema.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`role.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          <FormField id="user-status" label={t('form.status')} error={errors.status?.message}>
            {(field) => (
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger {...field} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatusSchema.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`status.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
            {t('common:actions.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {isEdit ? t('form.submitEdit') : t('form.submitCreate')}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
