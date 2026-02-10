import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopicInputCard from '../../components/content/TopicInputCard';
import DraftEditor from '../../components/content/DraftEditor';
import SeoAnalyzerPanel from '../../components/analyzer/SeoAnalyzerPanel';
import type { ContentDraft } from '../../backend';

export default function ContentWorkspacePage() {
  const { t } = useLanguage();
  const [currentDraft, setCurrentDraft] = useState<ContentDraft | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('content.title')}</h1>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">{t('content.newDraft')}</TabsTrigger>
          <TabsTrigger value="drafts">{t('content.myDrafts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <TopicInputCard onDraftCreated={setCurrentDraft} />

          {currentDraft && (
            <>
              <DraftEditor draft={currentDraft} onUpdate={setCurrentDraft} />
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('content.runAnalysis')}</CardTitle>
                    <Button onClick={() => setShowAnalyzer(!showAnalyzer)}>
                      {showAnalyzer ? t('common.close') : t('content.runAnalysis')}
                    </Button>
                  </div>
                </CardHeader>
                {showAnalyzer && (
                  <CardContent>
                    <SeoAnalyzerPanel draft={currentDraft} />
                  </CardContent>
                )}
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{t('common.noResults')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
