import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { i18n } from '@/lib/i18n'

interface GlobalErrorBoundaryProps {
  children: ReactNode
}

interface GlobalErrorBoundaryState {
  hasError: boolean
}

/**
 * Last line of defence: catches render errors that escape every route boundary, including
 * failures inside the providers. The fallback therefore avoids hooks, context and the router,
 * and reads translations straight from the i18n instance.
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  override state: GlobalErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled render error', error, info.componentStack)
  }

  override render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground"
      >
        <h1 className="text-2xl font-semibold">{i18n.t('errors:global.title')}</h1>
        <p className="max-w-md text-muted-foreground">{i18n.t('errors:global.description')}</p>
        <Button
          onClick={() => {
            window.location.reload()
          }}
        >
          {i18n.t('errors:global.reload')}
        </Button>
      </div>
    )
  }
}
