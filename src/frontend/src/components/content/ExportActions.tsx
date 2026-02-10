import { useLanguage } from '../../i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentDraft } from '../../backend';

interface ExportActionsProps {
  draft: ContentDraft;
}

export default function ExportActions({ draft }: ExportActionsProps) {
  const { t } = useLanguage();

  const generateMarkdown = () => {
    let markdown = `# ${draft.topic}\n\n`;
    markdown += `**${t('content.metaDescription')}:** ${draft.metaDescription}\n\n`;
    markdown += `**${t('content.keywords')}:** ${draft.keywords.join(', ')}\n\n`;
    markdown += `**${t('content.tags')}:** ${draft.seoTags.join(', ')}\n\n`;
    markdown += `---\n\n`;

    draft.sections.forEach((section) => {
      markdown += `## ${section.title}\n\n${section.content}\n\n`;
    });

    return markdown;
  };

  const handleCopy = () => {
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown);
    toast.success(t('common.success'));
  };

  const handleDownload = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.topic}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('common.success'));
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Copy className="h-4 w-4 me-2" />
        {t('content.copyToClipboard')}
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4 me-2" />
        {t('content.downloadMarkdown')}
      </Button>
    </>
  );
}
