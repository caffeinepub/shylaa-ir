import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { Button } from '@/components/ui/button';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isAuthenticated = !!identity;

  if (loginStatus === 'initializing') {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">{t('auth.accessDenied')}</h2>
        <p className="text-muted-foreground mb-6">{t('auth.accessDeniedMessage')}</p>
        <Button onClick={() => navigate({ to: '/' })}>{t('auth.backToHome')}</Button>
      </div>
    );
  }

  return <>{children}</>;
}
