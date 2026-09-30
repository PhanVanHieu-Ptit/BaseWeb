import { z } from 'zod'

// Only same-origin absolute paths ("/dashboard?x=1"); "//evil.com" would be protocol-relative.
const redirectStateSchema = z.object({
  from: z
    .string()
    .startsWith('/')
    .refine((value) => !value.startsWith('//')),
})

/** Reads the `from` path put in the router state by a route guard, guarding against open redirects. */
export function getRedirectPath(state: unknown, fallback: string): string {
  const result = redirectStateSchema.safeParse(state)
  return result.success ? result.data.from : fallback
}
