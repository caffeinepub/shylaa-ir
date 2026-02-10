import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import AccessDeniedScreen from '../common/AccessDeniedScreen';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
