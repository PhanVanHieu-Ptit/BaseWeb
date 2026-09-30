import { delay, http, HttpResponse } from 'msw'
import { z } from 'zod'

import { env } from '@/config/env'

import { activities, stats } from './data'
import { DEMO_ACCOUNT } from './demo-account'

// The access token is short-lived on purpose: keep the dashboard open for a while and the next
// request gets a 401, which makes the axios interceptor refresh the token and replay the request.
const ACCESS_TOKEN_TTL_MS = 30 * 1000
const REFRESH_TOKEN_TTL_MS = 10 * 60 * 1000

const credentialsSchema = z.object({ email: z.string(), password: z.string() })
const refreshBodySchema = z.object({ refreshToken: z.string() })

function url(path: string): string {
  return `${env.apiBaseUrl}${path}`
}

/** Stateless tokens: `<kind>.<userId>.<expiresAt>[.<nonce>]`, so they survive page reloads. */
function issueTokens() {
  const now = Date.now()
  const nonce = Math.random().toString(36).slice(2)
  return {
    accessToken: `access.${DEMO_ACCOUNT.id}.${String(now + ACCESS_TOKEN_TTL_MS)}.${nonce}`,
    refreshToken: `refresh.${DEMO_ACCOUNT.id}.${String(now + REFRESH_TOKEN_TTL_MS)}.${nonce}`,
  }
}

function isValidToken(token: string | undefined, kind: 'access' | 'refresh'): boolean {
  const [tokenKind, userId, expiresAt] = (token ?? '').split('.')
  return tokenKind === kind && userId === DEMO_ACCOUNT.id && Number(expiresAt) > Date.now()
}

function isAuthorized(request: Request): boolean {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  return isValidToken(token, 'access')
}

function unauthorized() {
  return HttpResponse.json(
    { message: 'Your session has expired.', code: 'UNAUTHORIZED' },
    { status: 401 },
  )
}

export const handlers = [
  http.post(url('/auth/login'), async ({ request }) => {
    await delay(400)
    const body = credentialsSchema.safeParse(await request.json())

    if (
      !body.success ||
      body.data.email !== DEMO_ACCOUNT.email ||
      body.data.password !== DEMO_ACCOUNT.password
    ) {
      return HttpResponse.json(
        { message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      ...issueTokens(),
      user: { id: DEMO_ACCOUNT.id, email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name },
    })
  }),

  http.post(url('/auth/refresh'), async ({ request }) => {
    await delay(200)
    const body = refreshBodySchema.safeParse(await request.json())

    if (!body.success || !isValidToken(body.data.refreshToken, 'refresh')) {
      return HttpResponse.json(
        { message: 'Refresh token is invalid or expired.', code: 'INVALID_REFRESH_TOKEN' },
        { status: 401 },
      )
    }

    return HttpResponse.json(issueTokens())
  }),

  http.post(url('/auth/logout'), () => new HttpResponse(null, { status: 204 })),

  http.get(url('/dashboard/stats'), async ({ request }) => {
    await delay(500)
    if (!isAuthorized(request)) return unauthorized()
    return HttpResponse.json(stats)
  }),

  http.get(url('/dashboard/activities'), async ({ request }) => {
    await delay(300)
    if (!isAuthorized(request)) return unauthorized()

    const params = new URL(request.url).searchParams
    const search = (params.get('search') ?? '').trim().toLowerCase()
    const page = Math.max(1, Number(params.get('page')) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(params.get('pageSize')) || 5))

    const matches = activities.filter(
      (activity) =>
        activity.user.toLowerCase().includes(search) ||
        activity.action.toLowerCase().includes(search),
    )

    return HttpResponse.json({
      items: matches.slice((page - 1) * pageSize, page * pageSize),
      total: matches.length,
      page,
      pageSize,
    })
  }),
]
