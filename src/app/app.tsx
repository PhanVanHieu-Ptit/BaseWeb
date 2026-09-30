import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router/dom'

import { GlobalErrorBoundary } from '@/components/global-error-boundary'
import { i18n } from '@/lib/i18n'

import { AppProviders } from './providers'
import { router } from './router'

export function App() {
  return (
    <GlobalErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </I18nextProvider>
    </GlobalErrorBoundary>
  )
}
