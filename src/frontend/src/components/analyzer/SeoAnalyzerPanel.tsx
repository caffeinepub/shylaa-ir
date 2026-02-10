import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { analyzeSeo } from '../../utils/seoAnalyzer';
import type { ContentDraft } from '../../backend';

interface SeoAnalyzerPanelProps {
  draft: ContentDraft;
}

export default function SeoAnalyzerPanel({ draft }: SeoAnalyzerPanelProps) {
  const { t, language } = useLanguage();
  const analysis = analyzeSeo(draft, language);

  return (
    <div className="space-y-6">
      {/* Score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">SEO Score</span>
          <span className="text-2xl font-bold">{analysis.score}/100</span>
        </div>
        <Progress value={analysis.score} className="h-2" />
      </div>

      {/* Checks */}
      <div className="space-y-3">
        {analysis.checks.map((check, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={check.passed ? 'default' : 'destructive'}>
                      {check.passed ? '✓' : '✗'}
                    </Badge>
                    <span className="font-medium">{check.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Suggestions</h4>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
