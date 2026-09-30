import { toast, type ExternalToast } from 'sonner'

import { getErrorMessage } from '@/lib/api-error'

interface PromiseMessages<T> {
  loading: string
  success: string | ((data: T) => string)
  /** Defaults to the message extracted from the rejection. */
  error?: string | ((error: unknown) => string)
}

/**
 * Thin wrapper around `sonner`: call sites never import the library directly, and error toasts
 * always show the backend message.
 */
export const notify = {
  success: (message: string, options?: ExternalToast) => toast.success(message, options),

  info: (message: string, options?: ExternalToast) => toast.info(message, options),

  warning: (message: string, options?: ExternalToast) => toast.warning(message, options),

  /** Pass a string, or any thrown value (`AxiosError`, `ApiError`, `Error`) to show its message. */
  error: (error: unknown, options?: ExternalToast) =>
    toast.error(typeof error === 'string' ? error : getErrorMessage(error), options),

  /** Shows loading → success/error for `promise`, and returns it so callers can keep awaiting. */
  promise: <T>(promise: Promise<T>, messages: PromiseMessages<T>, options?: ExternalToast) => {
    const { loading, success, error } = messages
    toast.promise(promise, {
      loading,
      success,
      error: (reason: unknown) =>
        typeof error === 'function' ? error(reason) : (error ?? getErrorMessage(reason)),
      ...options,
    })
    return promise
  },

  dismiss: (id?: string | number) => toast.dismiss(id),
}
