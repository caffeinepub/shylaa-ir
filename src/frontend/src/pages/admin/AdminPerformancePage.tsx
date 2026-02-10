import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminPerformancePage() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">{t('common.noResults')}</p>
      </CardContent>
    </Card>
  );
}
