import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, Search, BarChart3, List } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: List,
      title: t('home.features.platforms'),
      description: t('home.features.platformsDesc'),
      path: '/platforms',
    },
    {
      icon: FileText,
      title: t('home.features.content'),
      description: t('home.features.contentDesc'),
      path: '/content',
    },
    {
      icon: Search,
      title: t('home.features.analysis'),
      description: t('home.features.analysisDesc'),
      path: '/content',
    },
    {
      icon: BarChart3,
      title: t('home.features.tracking'),
      description: t('home.features.trackingDesc'),
      path: '/performance',
    },
  ];

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="relative mb-16 rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1600x600.png"
          alt="Hero"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
            <p className="text-xl text-muted-foreground mb-6">{t('home.subtitle')}</p>
            <Button size="lg" onClick={() => navigate({ to: '/platforms' })}>
              {t('home.getStarted')}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate({ to: feature.path })}
            >
              <CardHeader>
                <Icon className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
