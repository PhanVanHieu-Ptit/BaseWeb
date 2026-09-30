import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/app'
import { env } from '@/config/env'
import { setupAuth } from '@/features/auth'
import '@/lib/i18n'

import './index.css'

async function enableMocking(): Promise<void> {
  // `import.meta.env.DEV` is a literal at build time, so this whole branch (and MSW) is
  // removed from production bundles.
  if (import.meta.env.DEV && env.enableMocks) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledFrame: 'bypass' })
  }
}

async function bootstrap(): Promise<void> {
  await enableMocking()
  setupAuth()

  const container = document.getElementById('root')
  if (!container) throw new Error('Root element #root not found')

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
