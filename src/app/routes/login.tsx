import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/config/env'
import { LoginForm } from '@/features/auth'
import { DEMO_ACCOUNT } from '@/mocks/demo-account'

export function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        {import.meta.env.DEV && env.enableMocks && (
          <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            Mock API enabled. Sign in with <code className="font-mono">{DEMO_ACCOUNT.email}</code> /{' '}
            <code className="font-mono">{DEMO_ACCOUNT.password}</code>.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
