import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../i18n/LanguageProvider';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container py-12 text-center max-w-md mx-auto">
      <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
      <h2 className="text-2xl font-bold mb-4">{t('auth.accessDenied')}</h2>
      <p className="text-muted-foreground mb-6">{t('auth.accessDeniedMessage')}</p>
      <Button onClick={() => navigate({ to: '/' })}>{t('auth.backToHome')}</Button>
    </div>
  );
}
