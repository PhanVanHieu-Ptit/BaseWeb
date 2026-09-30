import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { getErrorMessage } from '@/lib/api-error'

import { useLogin } from '../api/login'
import { loginSchema, type LoginInput } from '../types'

type FieldErrors = Partial<Record<keyof LoginInput, string>>

export function LoginForm() {
  const [values, setValues] = useState<LoginInput>({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const login = useLogin()

  function updateField(field: keyof LoginInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = loginSchema.safeParse(values)
    if (!result.success) {
      const { fieldErrors: errors } = z.flattenError(result.error)
      setFieldErrors({ email: errors.email?.[0], password: errors.password?.[0] })
      return
    }

    setFieldErrors({})
    login.mutate(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => {
            updateField('email', event.target.value)
          }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => {
            updateField('password', event.target.value)
          }}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? 'password-error' : undefined}
        />
        {fieldErrors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {login.isError && (
        <p role="alert" className="text-sm text-destructive">
          {getErrorMessage(login.error)}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending && <Spinner />}
        Sign in
      </Button>
    </form>
  )
}
