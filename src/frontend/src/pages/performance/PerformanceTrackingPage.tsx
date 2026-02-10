import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PerformanceTrackingPage() {
  const { t } = useLanguage();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('performance.title')}</h1>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
