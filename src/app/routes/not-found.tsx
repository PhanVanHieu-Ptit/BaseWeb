import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'

export function Component() {
  const { t } = useTranslation(['errors', 'common'])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">{t('errors:notFound.code')}</p>
      <h1 className="text-2xl font-semibold">{t('errors:notFound.title')}</h1>
      <p className="max-w-md text-muted-foreground">{t('errors:notFound.description')}</p>
      <Button asChild>
        <Link to={paths.root}>{t('common:actions.backToHome')}</Link>
      </Button>
    </div>
  )
}
