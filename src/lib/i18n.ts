import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { STORAGE_KEYS } from '@/config/constants'
import { defaultLanguage, defaultNS, resources, supportedLanguages } from '@/locales/resources'

function syncDocumentLanguage(language: string): void {
  document.documentElement.lang = language
}

// Resources are bundled, so init is synchronous and there is no loading state to handle.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    // `vi-VN` → `vi`, so region variants resolve to a supported language.
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    defaultNS,
    ns: Object.keys(resources[defaultLanguage]),
    interpolation: { escapeValue: false },
    detection: {
      // A saved choice wins; otherwise fall back to the browser language.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEYS.language,
      caches: ['localStorage'],
    },
  })

syncDocumentLanguage(i18n.resolvedLanguage ?? defaultLanguage)
i18n.on('languageChanged', syncDocumentLanguage)

export { i18n }
