import enAuth from './en/auth.json'
import enCommon from './en/common.json'
import enDashboard from './en/dashboard.json'
import enErrors from './en/errors.json'
import enSettings from './en/settings.json'
import enUsers from './en/users.json'
import viAuth from './vi/auth.json'
import viCommon from './vi/common.json'
import viDashboard from './vi/dashboard.json'
import viErrors from './vi/errors.json'
import viSettings from './vi/settings.json'
import viUsers from './vi/users.json'

export const supportedLanguages = ['vi', 'en'] as const
export type Language = (typeof supportedLanguages)[number]

export const defaultLanguage: Language = 'vi'
export const defaultNS = 'common'

const vi = {
  common: viCommon,
  auth: viAuth,
  dashboard: viDashboard,
  errors: viErrors,
  settings: viSettings,
  users: viUsers,
}

/** Vietnamese is the source of truth for key types; `en` must have the same shape. */
export const resources = {
  vi,
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    errors: enErrors,
    settings: enSettings,
    users: enUsers,
  },
} satisfies Record<Language, typeof vi>
