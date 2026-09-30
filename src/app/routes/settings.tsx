import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PreferencesPanel, ProfileForm } from '@/features/settings'

export function Component() {
  const { t } = useTranslation('settings')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-2xl">
        <TabsList>
          <TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('tabs.preferences')}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
