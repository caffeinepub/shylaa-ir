import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useGenerateOrUpdateDraft } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ExportActions from './ExportActions';
import type { ContentDraft } from '../../backend';

interface DraftEditorProps {
  draft: ContentDraft;
  onUpdate: (draft: ContentDraft) => void;
}

export default function DraftEditor({ draft, onUpdate }: DraftEditorProps) {
  const { t } = useLanguage();
  const updateDraft = useGenerateOrUpdateDraft();

  const [sections, setSections] = useState(draft.sections);
  const [metaDescription, setMetaDescription] = useState(draft.metaDescription);
  const [tags, setTags] = useState(draft.seoTags.join(', '));
  const [keywords, setKeywords] = useState(draft.keywords.join(', '));

  const handleSave = async () => {
    const updatedDraft: ContentDraft = {
      ...draft,
      sections,
      metaDescription,
      seoTags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
      updated: BigInt(Date.now() * 1000000),
    };

    try {
      await updateDraft.mutateAsync(updatedDraft);
      onUpdate(updatedDraft);
      toast.success(t('content.saved'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{draft.topic}</CardTitle>
          <div className="flex gap-2">
            <ExportActions draft={draft} />
            <Button onClick={handleSave} disabled={updateDraft.isPending}>
              {updateDraft.isPending ? t('common.loading') : t('content.save')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sections */}
        <div>
          <h3 className="font-semibold mb-4">{t('content.sections')}</h3>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index}>
                <Label>{section.title}</Label>
                <Textarea
                  value={section.content}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[index] = { ...section, content: e.target.value };
                    setSections(newSections);
                  }}
                  rows={6}
                  placeholder={`${t('content.body')}...`}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Meta Description */}
        <div>
          <Label>{t('content.metaDescription')}</Label>
          <Textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            placeholder={t('content.metaDescription')}
          />
        </div>

        {/* Tags */}
        <div>
          <Label>{t('content.tags')}</Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        {/* Keywords */}
        <div>
          <Label>{t('content.keywords')}</Label>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
      </CardContent>
    </Card>
  );
}
