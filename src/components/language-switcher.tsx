import { CheckIcon, LanguagesIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/hooks/use-language'
import type { Language } from '@/locales/resources'

const FLAGS: Record<Language, string> = { vi: '🇻🇳', en: '🇬🇧' }

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const { language, languages, changeLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={t('language.switch')}>
          <LanguagesIcon />
          <span className="font-medium uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => {
              changeLanguage(code)
            }}
          >
            <span aria-hidden="true">{FLAGS[code]}</span>
            {t(`language.${code}`)}
            {code === language && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
