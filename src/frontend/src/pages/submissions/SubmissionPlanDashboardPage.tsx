import { useLanguage } from '../../i18n/LanguageProvider';
import { useGetSubmissionPlans, useSearchPlatforms } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '../../components/submissions/StatusBadge';
import SubmissionPlanEditor from '../../components/submissions/SubmissionPlanEditor';
import { ListingStatus } from '../../backend';

export default function SubmissionPlanDashboardPage() {
  const { t } = useLanguage();
  const { data: plans = [], isLoading } = useGetSubmissionPlans();
  const { data: platforms = [] } = useSearchPlatforms(null, null);

  const statusCounts = {
    notStarted: plans.filter((p) => p.status === ListingStatus.notStarted).length,
    inProgress: plans.filter((p) => p.status === ListingStatus.inProgress).length,
    submitted: plans.filter((p) => p.status === ListingStatus.submitted).length,
    accepted: plans.filter((p) => p.status === ListingStatus.accepted).length,
    rejected: plans.filter((p) => p.status === ListingStatus.rejected).length,
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('submissions.title')}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold mb-2">{count}</div>
              <StatusBadge status={ListingStatus[status as keyof typeof ListingStatus]} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plans List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('common.noResults')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const platform = platforms.find((p) => p.id === plan.platformId);
            return (
              <Card key={`${plan.platformId}-${plan.userId}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{platform?.name || 'Unknown Platform'}</CardTitle>
                      <div className="flex gap-2 mb-2">
                        <StatusBadge status={plan.status} />
                        {platform && (
                          <Badge variant="outline">{t(`category.${platform.category}`)}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SubmissionPlanEditor plan={plan} platform={platform} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
