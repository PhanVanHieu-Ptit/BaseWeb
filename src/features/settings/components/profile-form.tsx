import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormField } from '@/components/form-field'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/features/auth'
import { notify } from '@/lib/notify'

import { profileSchema, type ProfileInput } from '../types'

const SAVE_DELAY_MS = 600

/** Stand-in for `PATCH /me`: replace with a mutation hook once the endpoint exists. */
function saveProfile(input: ProfileInput): Promise<ProfileInput> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(input)
    }, SAVE_DELAY_MS)
  })
}

function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

export function ProfileForm() {
  const { t } = useTranslation('settings')
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const name = useWatch({ control, name: 'name' })

  async function onSubmit(values: ProfileInput) {
    const saved = await saveProfile(values)
    // Re-baseline the form so "Save changes" is disabled until the next edit.
    reset(saved)
    notify.success(t('profile.saved'))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title')}</CardTitle>
        <CardDescription>{t('profile.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('profile.avatar')}</p>
              <Button type="button" variant="outline" size="sm" disabled>
                {t('profile.changeAvatar')}
              </Button>
              <p className="text-xs text-muted-foreground">{t('profile.avatarHint')}</p>
            </div>
          </div>

          <FormField id="profile-name" label={t('profile.name')} error={errors.name?.message}>
            {(control) => <Input autoComplete="name" {...control} {...register('name')} />}
          </FormField>

          <FormField id="profile-email" label={t('profile.email')} error={errors.email?.message}>
            {(control) => (
              <Input type="email" autoComplete="email" {...control} {...register('email')} />
            )}
          </FormField>

          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? t('profile.saving') : t('profile.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
