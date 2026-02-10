import { useLanguage } from '../../i18n/LanguageProvider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { ExternalBlob } from '../../backend';

interface ImageUploadFieldProps {
  image: ExternalBlob | null;
  onImageChange: (image: ExternalBlob | null) => void;
}

export default function ImageUploadField({ image, onImageChange }: ImageUploadFieldProps) {
  const { t } = useLanguage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      onImageChange(blob);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Label>{t('content.image')}</Label>
      {image ? (
        <div className="relative mt-2">
          <img
            src={image.getDirectURL()}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 end-2"
            onClick={() => onImageChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('content.uploadImage')}</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </label>
        </div>
      )}
    </div>
  );
}
