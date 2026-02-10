import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGenerateOrUpdateDraft } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ImageUploadField from './ImageUploadField';
import type { ContentDraft } from '../../backend';
import { ExternalBlob } from '../../backend';

interface TopicInputCardProps {
  onDraftCreated: (draft: ContentDraft) => void;
}

export default function TopicInputCard({ onDraftCreated }: TopicInputCardProps) {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const generateDraft = useGenerateOrUpdateDraft();

  const [topic, setTopic] = useState('');
  const [image, setImage] = useState<ExternalBlob | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !identity) return;

    try {
      const draft: ContentDraft = {
        id: BigInt(0),
        topic: topic.trim(),
        mainImage: image || undefined,
        sections: [
          { title: t('content.intro'), content: '' },
          { title: t('content.body'), content: '' },
          { title: t('content.conclusion'), content: '' },
        ],
        metaDescription: '',
        seoTags: [],
        keywords: [],
        author: identity.getPrincipal(),
        versionHistory: [],
        created: BigInt(Date.now() * 1000000),
        updated: BigInt(Date.now() * 1000000),
      };

      await generateDraft.mutateAsync(draft);
      onDraftCreated(draft);
      toast.success(t('common.success'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('content.newDraft')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="topic">{t('content.topic')} *</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('content.topicPlaceholder')}
          />
        </div>

        <ImageUploadField image={image} onImageChange={setImage} />

        <Button
          onClick={handleGenerate}
          disabled={!topic.trim() || generateDraft.isPending}
          className="w-full"
        >
          {generateDraft.isPending ? t('content.generating') : t('content.generate')}
        </Button>
      </CardContent>
    </Card>
  );
}
