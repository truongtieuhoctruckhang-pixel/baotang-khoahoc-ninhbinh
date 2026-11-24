import { useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { StationImage } from '../components/StationImage';
import { compressImageToDataUrl } from '../lib/imageUpload';
import { INPUT_CLASS, LABEL_CLASS, formatFriendlyError } from './adminUtils';

interface CoverImageFieldProps {
  label: string;
  value: string;
  alt: string;
  placeholder?: string;
  helperText?: string;
  uploadButtonLabel?: string;
  previewWidthClass?: string;
  onChange: (nextUrlOrDataUrl: string) => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
  successToastText?: string;
}

export function CoverImageField({
  label,
  value,
  alt,
  placeholder = 'https://... hoặc /src/assets/images/...',
  helperText,
  uploadButtonLabel = 'Tải ảnh lên (<300KB)',
  previewWidthClass = 'h-24 w-full sm:w-40',
  onChange,
  onNotify,
  successToastText = 'Đã nén ảnh dưới 300KB và tải lên thành công.',
}: CoverImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      onChange(dataUrl);
      onNotify('success', successToastText);
    } catch (err) {
      onNotify('error', formatFriendlyError(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sm:col-span-2">
      <label className={LABEL_CLASS}>{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={`${previewWidthClass} shrink-0 overflow-hidden rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD]`}
        >
          {value ? (
            <StationImage src={value} alt={alt} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1 space-y-2.5">
          <input
            type="text"
            value={
              value.startsWith('data:image/')
                ? '[Ảnh đã nén base64 — dán link mới để thay thế]'
                : value
            }
            onChange={(e) => {
              const nextVal = e.target.value;
              if (!nextVal.startsWith('[Ảnh đã nén')) {
                onChange(nextVal);
              }
            }}
            placeholder={placeholder}
            className={INPUT_CLASS}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-[10px] border border-[#137A6F] bg-[#DCEFEA]/60 px-3 py-1.5 text-xs font-semibold text-[#0B3D3A] hover:bg-[#DCEFEA] disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5 text-[#137A6F]" />
              )}
              <span>{uploadButtonLabel}</span>
            </button>
            {helperText && <span className="text-[11px] text-[#4A5B60]">{helperText}</span>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
