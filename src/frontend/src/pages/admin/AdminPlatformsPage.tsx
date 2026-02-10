import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useSearchPlatforms, useAddPlatform, useUpdatePlatform } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import { formatShortDate } from '../../utils/locale';

export default function AdminPlatformsPage() {
  const { t, language } = useLanguage();
  const { data: platforms = [], isLoading } = useSearchPlatforms(null, null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlatforms = platforms.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('admin.platforms')}</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 me-2" />
            {t('common.add')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('platforms.name')}</TableHead>
                <TableHead>{t('platforms.category')}</TableHead>
                <TableHead>{t('platforms.country')}</TableHead>
                <TableHead>{t('admin.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlatforms.map((platform) => (
                <TableRow key={Number(platform.id)}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell>{t(`category.${platform.category}`)}</TableCell>
                  <TableCell>{platform.country}</TableCell>
                  <TableCell>{formatShortDate(platform.created, language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
