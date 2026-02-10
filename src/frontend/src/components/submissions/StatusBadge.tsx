import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../i18n/LanguageProvider';
import { ListingStatus } from '../../backend';

interface StatusBadgeProps {
  status: ListingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();

  const getStatusKey = (status: ListingStatus): string => {
    if (status === ListingStatus.notStarted) return 'notStarted';
    if (status === ListingStatus.inProgress) return 'inProgress';
    if (status === ListingStatus.submitted) return 'submitted';
    if (status === ListingStatus.accepted) return 'accepted';
    if (status === ListingStatus.rejected) return 'rejected';
    return 'notStarted';
  };

  const statusKey = getStatusKey(status);

  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    notStarted: 'secondary',
    inProgress: 'default',
    submitted: 'outline',
    accepted: 'default',
    rejected: 'destructive',
  };

  return <Badge variant={variants[statusKey]}>{t(`submissions.${statusKey}`)}</Badge>;
}
