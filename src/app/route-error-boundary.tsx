import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/api-error'

export function RouteErrorBoundary() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : 'Something went wrong'
  const detail = isRouteErrorResponse(error)
    ? 'The page could not be loaded.'
    : getErrorMessage(error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="max-w-md text-muted-foreground">{detail}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            window.location.reload()
          }}
        >
          Reload
        </Button>
        <Button asChild>
          <Link to={paths.root}>Go home</Link>
        </Button>
      </div>
    </div>
  )
}
