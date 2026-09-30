import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface PreferenceRowProps {
  label: string
  hint: string
  children: ReactNode
}

function PreferenceRow({ label, hint, children }: PreferenceRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
  )
}

/** Language and theme apply instantly and persist on their own: no save button needed. */
export function PreferencesPanel() {
  const { t } = useTranslation('settings')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('preferences.title')}</CardTitle>
        <CardDescription>{t('preferences.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PreferenceRow label={t('preferences.language')} hint={t('preferences.languageHint')}>
          <LanguageSwitcher />
        </PreferenceRow>
        <Separator />
        <PreferenceRow label={t('preferences.theme')} hint={t('preferences.themeHint')}>
          <ThemeToggle />
        </PreferenceRow>
      </CardContent>
    </Card>
  )
}
