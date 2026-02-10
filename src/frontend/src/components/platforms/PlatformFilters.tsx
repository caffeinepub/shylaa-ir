import { useLanguage } from '../../i18n/LanguageProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PlatformCategory } from '../../backend';

interface PlatformFiltersProps {
  selectedCategory: PlatformCategory | null;
  selectedCountry: string | null;
  onCategoryChange: (category: PlatformCategory | null) => void;
  onCountryChange: (country: string | null) => void;
}

export default function PlatformFilters({
  selectedCategory,
  selectedCountry,
  onCategoryChange,
  onCountryChange,
}: PlatformFiltersProps) {
  const { t } = useLanguage();

  const categories: PlatformCategory[] = [
    'directory' as PlatformCategory,
    'forum' as PlatformCategory,
    'socialMedia' as PlatformCategory,
    'contentSharing' as PlatformCategory,
    'reviewSite' as PlatformCategory,
    'news' as PlatformCategory,
  ];

  const countries = ['Iran', 'USA', 'UK', 'Global'];

  const handleClear = () => {
    onCategoryChange(null);
    onCountryChange(null);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('platforms.category')}</label>
            <Select
              value={selectedCategory || 'all'}
              onValueChange={(value) => onCategoryChange(value === 'all' ? null : (value as PlatformCategory))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('platforms.allCategories')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`category.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('platforms.country')}</label>
            <Select
              value={selectedCountry || 'all'}
              onValueChange={(value) => onCountryChange(value === 'all' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('platforms.allCountries')}</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={handleClear} className="w-full">
              {t('common.clear')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
