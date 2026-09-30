import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/api-error'

export function RouteErrorBoundary() {
  const { t } = useTranslation('errors')
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : t('route.title')
  const detail = isRouteErrorResponse(error) ? t('route.loadFailed') : getErrorMessage(error)

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
          {t('global.reload')}
        </Button>
        <Button asChild>
          <Link to={paths.root}>{t('route.goHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
