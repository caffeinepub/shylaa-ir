import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    { path: '/admin/platforms', label: t('admin.platforms') },
    { path: '/admin/submissions', label: t('admin.submissions') },
    { path: '/admin/drafts', label: t('admin.drafts') },
    { path: '/admin/keywords', label: t('admin.keywords') },
    { path: '/admin/performance', label: t('admin.performance') },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <nav className="space-y-2">
              {sections.map((section) => {
                const isActive = location.pathname === section.path;
                return (
                  <Button
                    key={section.path}
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => navigate({ to: section.path })}
                  >
                    {section.label}
                  </Button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
