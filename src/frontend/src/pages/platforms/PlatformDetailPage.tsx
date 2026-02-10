import { useParams, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useSearchPlatforms, useCreateOrUpdateSubmissionPlan } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ListingStatus } from '../../backend';

export default function PlatformDetailPage() {
  const { platformId } = useParams({ from: '/platforms/$platformId' });
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: platforms = [] } = useSearchPlatforms(null, null);
  const createPlan = useCreateOrUpdateSubmissionPlan();

  const platform = platforms.find((p) => Number(p.id) === Number(platformId));

  const handleAddToPlan = async () => {
    if (!identity || !platform) return;

    try {
      await createPlan.mutateAsync({
        platformId: platform.id,
        userId: identity.getPrincipal(),
        status: ListingStatus.notStarted,
        notes: '',
        submissionUrl: undefined,
        submissionDate: undefined,
        created: BigInt(Date.now() * 1000000),
        updated: BigInt(Date.now() * 1000000),
      });
      toast.success(t('common.success'));
      navigate({ to: '/submissions' });
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  if (!platform) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/platforms' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 me-2" />
        {t('common.back')}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2">
              <Badge variant="secondary">{t(`category.${platform.category}`)}</Badge>
              <Badge variant="outline">{platform.country}</Badge>
            </div>
            {identity && (
              <Button onClick={handleAddToPlan} disabled={createPlan.isPending}>
                {t('platforms.addToPlan')}
              </Button>
            )}
          </div>
          <CardTitle className="text-3xl">{platform.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">{t('platforms.description')}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{platform.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">{t('platforms.seoImpact')}</h4>
              <p className="text-sm text-muted-foreground">
                {Number(platform.estimatedSeoImpact.min)} - {Number(platform.estimatedSeoImpact.max)}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">{t('platforms.traffic')}</h4>
              <p className="text-sm text-muted-foreground">
                {Number(platform.estimatedTraffic.min)} - {Number(platform.estimatedTraffic.max)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{t('platforms.requirements')}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{platform.requirements}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{t('platforms.submissionGuide')}</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">{platform.submissionGuide}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
