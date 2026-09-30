import type { defaultNS, resources } from '@/locales/resources'

// Makes `t('namespace:key')` fully typed: unknown keys fail typecheck and editors autocomplete.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['vi']
  }
}
