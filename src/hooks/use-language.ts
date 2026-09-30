import { useTranslation } from 'react-i18next'

import { defaultLanguage, supportedLanguages, type Language } from '@/locales/resources'

function toLanguage(value: string | undefined): Language {
  return supportedLanguages.find((language) => language === value) ?? defaultLanguage
}

/** Current UI language and a setter. The choice is persisted to localStorage by i18next. */
export function useLanguage() {
  const { i18n } = useTranslation()

  return {
    language: toLanguage(i18n.resolvedLanguage),
    languages: supportedLanguages,
    changeLanguage: (language: Language) => {
      void i18n.changeLanguage(language)
    },
  }
}
