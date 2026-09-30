import type { AxiosError } from 'axios'
import { z } from 'zod'

/** Error payload we expect from the backend. Every field is optional on purpose. */
const errorBodySchema = z.object({
  message: z.string().optional(),
  code: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
})

interface ApiErrorOptions {
  status?: number
  code?: string
  fieldErrors?: Record<string, string[]>
  cause?: unknown
}

/** Normalised error thrown by `axiosClient` for every failed request. */
export class ApiError extends Error {
  /** HTTP status, `undefined` when no response was received (network error, timeout). */
  readonly status: number | undefined
  readonly code: string | undefined
  readonly fieldErrors: Record<string, string[]>

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.fieldErrors = options.fieldErrors ?? {}
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status
  const body = errorBodySchema.safeParse(error.response?.data)

  let message: string
  if (body.success && body.data.message) {
    message = body.data.message
  } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    message = 'The request timed out. Please try again.'
  } else if (!error.response) {
    message = 'Unable to reach the server. Check your connection and try again.'
  } else {
    message = `Request failed with status ${String(status)}.`
  }

  return new ApiError(message, {
    status,
    code: body.success ? body.data.code : undefined,
    fieldErrors: body.success ? body.data.errors : undefined,
    cause: error,
  })
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
