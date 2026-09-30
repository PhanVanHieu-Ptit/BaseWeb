import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'

interface FieldControlProps {
  id: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

interface FormFieldProps {
  id: string
  label: string
  error?: string | undefined
  /** Receives the a11y props to spread onto the control. */
  children: (control: FieldControlProps) => ReactNode
}

/** Label + control + error message with the aria wiring the login form uses. */
export function FormField({ id, label, error, children }: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
