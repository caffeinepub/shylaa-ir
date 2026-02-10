import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManualKeywordEntry from '../../components/keywords/ManualKeywordEntry';

export default function KeywordToolsPage() {
  const { t } = useLanguage();

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('keywords.title')}</h1>
      </div>

      <Tabs defaultValue="manual">
        <TabsList>
          <TabsTrigger value="manual">{t('keywords.manual')}</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <ManualKeywordEntry />
        </TabsContent>
      </Tabs>
    </div>
  );
}
