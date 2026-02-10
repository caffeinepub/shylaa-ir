import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';

interface Keyword {
  keyword: string;
  targetDensity: number;
}

export default function ManualKeywordEntry() {
  const { t } = useLanguage();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newDensity, setNewDensity] = useState('1.5');

  const handleAdd = () => {
    if (!newKeyword.trim()) return;

    setKeywords([
      ...keywords,
      { keyword: newKeyword.trim(), targetDensity: parseFloat(newDensity) || 1.5 },
    ]);
    setNewKeyword('');
    setNewDensity('1.5');
  };

  const handleRemove = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('keywords.manual')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label>{t('keywords.keyword')}</Label>
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder={t('keywords.keyword')}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <Label>{t('keywords.targetDensity')}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={newDensity}
                onChange={(e) => setNewDensity(e.target.value)}
              />
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {keywords.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('keywords.keyword')}</TableHead>
                <TableHead>{t('keywords.targetDensity')}</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((kw, index) => (
                <TableRow key={index}>
                  <TableCell>{kw.keyword}</TableCell>
                  <TableCell>{kw.targetDensity}%</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
