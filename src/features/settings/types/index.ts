import { z } from 'zod'

import { i18n } from '@/lib/i18n'

/** Messages resolve at validation time, so they follow the language active when the user submits. */
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: () => i18n.t('settings:validation.nameRequired') })
    .max(60, { error: () => i18n.t('settings:validation.nameMax') }),
  email: z.email({ error: () => i18n.t('settings:validation.email') }),
})
export type ProfileInput = z.infer<typeof profileSchema>
