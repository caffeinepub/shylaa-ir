import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useSearchPlatforms } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import PlatformFilters from '../../components/platforms/PlatformFilters';
import type { PlatformCategory } from '../../backend';

export default function PlatformsListPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlatformCategory | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: platforms = [], isLoading } = useSearchPlatforms(selectedCategory, selectedCountry);

  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    platform.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('platforms.title')}</h1>
        <p className="text-muted-foreground">{t('home.features.platformsDesc')}</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('platforms.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 me-2" />
          {t('platforms.filter')}
        </Button>
      </div>

      {showFilters && (
        <PlatformFilters
          selectedCategory={selectedCategory}
          selectedCountry={selectedCountry}
          onCategoryChange={setSelectedCategory}
          onCountryChange={setSelectedCountry}
        />
      )}

      {/* Platforms Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      ) : filteredPlatforms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.map((platform) => (
            <Card
              key={Number(platform.id)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate({ to: `/platforms/${platform.id}` })}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{t(`category.${platform.category}`)}</Badge>
                  <span className="text-xs text-muted-foreground">{platform.country}</span>
                </div>
                <CardTitle>{platform.name}</CardTitle>
                <CardDescription className="line-clamp-2">{platform.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('platforms.seoImpact')}: </span>
                    <span className="font-medium">
                      {Number(platform.estimatedSeoImpact.min)}-{Number(platform.estimatedSeoImpact.max)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('platforms.traffic')}: </span>
                    <span className="font-medium">
                      {Number(platform.estimatedTraffic.min)}-{Number(platform.estimatedTraffic.max)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
