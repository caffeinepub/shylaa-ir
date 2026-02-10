import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useCreateOrUpdateSubmissionPlan } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { SubmissionPlan, PlatformCatalogEntry } from '../../backend';
import { ListingStatus } from '../../backend';

interface SubmissionPlanEditorProps {
  plan: SubmissionPlan;
  platform?: PlatformCatalogEntry;
}

export default function SubmissionPlanEditor({ plan, platform }: SubmissionPlanEditorProps) {
  const { t } = useLanguage();
  const updatePlan = useCreateOrUpdateSubmissionPlan();

  const getStatusKey = (status: ListingStatus): string => {
    if (status === ListingStatus.notStarted) return 'notStarted';
    if (status === ListingStatus.inProgress) return 'inProgress';
    if (status === ListingStatus.submitted) return 'submitted';
    if (status === ListingStatus.accepted) return 'accepted';
    if (status === ListingStatus.rejected) return 'rejected';
    return 'notStarted';
  };

  const [status, setStatus] = useState(getStatusKey(plan.status));
  const [notes, setNotes] = useState(plan.notes);
  const [submissionUrl, setSubmissionUrl] = useState(plan.submissionUrl || '');

  const handleSave = async () => {
    const statusMap: Record<string, ListingStatus> = {
      notStarted: ListingStatus.notStarted,
      inProgress: ListingStatus.inProgress,
      submitted: ListingStatus.submitted,
      accepted: ListingStatus.accepted,
      rejected: ListingStatus.rejected,
    };

    try {
      await updatePlan.mutateAsync({
        ...plan,
        status: statusMap[status],
        notes,
        submissionUrl: submissionUrl || undefined,
        submissionDate: status === 'submitted' ? BigInt(Date.now() * 1000000) : plan.submissionDate,
        updated: BigInt(Date.now() * 1000000),
      });
      toast.success(t('common.success'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{t('submissions.status')}</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notStarted">{t('submissions.notStarted')}</SelectItem>
              <SelectItem value="inProgress">{t('submissions.inProgress')}</SelectItem>
              <SelectItem value="submitted">{t('submissions.submitted')}</SelectItem>
              <SelectItem value="accepted">{t('submissions.accepted')}</SelectItem>
              <SelectItem value="rejected">{t('submissions.rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('submissions.submissionUrl')}</Label>
          <Input
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <Label>{t('submissions.notes')}</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t('submissions.notes')}
        />
      </div>

      <Button onClick={handleSave} disabled={updatePlan.isPending}>
        {updatePlan.isPending ? t('common.loading') : t('common.save')}
      </Button>
    </div>
  );
}
