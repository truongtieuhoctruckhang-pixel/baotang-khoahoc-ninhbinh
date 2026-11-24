import { Suspense, lazy } from 'react';
import { Eye, Loader2, Save, Send } from 'lucide-react';
import type { AboutPageData } from '../data';
import { ChemTextField } from './ChemTextField';
import { CoverImageField } from './CoverImageField';
import { INPUT_CLASS, LABEL_CLASS } from './adminUtils';

const LazyRichTextEditor = lazy(() => import('./RichTextEditor'));

interface AboutEditorTabProps {
  draftAbout: AboutPageData;
  aboutDirty: boolean;
  saving: boolean;
  onChangeDraftAbout: (updater: (prev: AboutPageData) => AboutPageData) => void;
  onPreview: () => void;
  onSaveAbout: (status: 'draft' | 'published') => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export function AboutEditorTab({
  draftAbout,
  aboutDirty,
  saving,
  onChangeDraftAbout,
  onPreview,
  onSaveAbout,
  onNotify,
}: AboutEditorTabProps) {
  return (
    <div className="passport-frame space-y-5 rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DAC3] pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A6414]">
            Đường dẫn công khai: #/gioi-thieu
          </span>
          <h2 className="font-serif text-xl font-bold text-[#17262B]">
            Chỉnh sửa Trang Giới thiệu Dự án
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              draftAbout.status === 'published'
                ? 'bg-[#E4F4EA] text-[#2E8B57]'
                : 'bg-[#F6EBCB] text-[#8A6414]'
            }`}
          >
            {draftAbout.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
          </span>
          {aboutDirty && (
            <span className="rounded-full bg-[#FBE9E3] px-2.5 py-1 text-xs font-semibold text-[#C2553A]">
              Chưa lưu
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Tiêu đề trang Giới thiệu</label>
          <ChemTextField
            value={draftAbout.tieuDe}
            maxLength={200}
            compactToolbar
            onChange={(nextVal) => onChangeDraftAbout((prev) => ({ ...prev, tieuDe: nextVal }))}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Phụ đề / Khẩu hiệu trang</label>
          <ChemTextField
            value={draftAbout.phuDe}
            maxLength={300}
            compactToolbar
            onChange={(nextVal) => onChangeDraftAbout((prev) => ({ ...prev, phuDe: nextVal }))}
            className={INPUT_CLASS}
          />
        </div>

        <CoverImageField
          label="Ảnh bìa trang Giới thiệu (link hoặc tải lên <300KB)"
          value={draftAbout.anhBia}
          alt={draftAbout.tieuDe}
          onChange={(nextAnhBia) => onChangeDraftAbout((prev) => ({ ...prev, anhBia: nextAnhBia }))}
          onNotify={onNotify}
          successToastText="Đã nén ảnh bìa Giới thiệu dưới 300KB."
        />

        <div className="sm:col-span-2">
          <label className={LABEL_CLASS}>Nội dung chi tiết trang Giới thiệu</label>
          <Suspense
            fallback={
              <div className="flex h-48 items-center justify-center rounded-[14px] border border-[#E3DAC3] bg-[#F3EDDD] text-xs font-semibold text-[#4A5B60]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#137A6F]" />
                Đang tải trình soạn thảo...
              </div>
            }
          >
            <LazyRichTextEditor
              value={draftAbout.noiDungHtml}
              onChange={(html) => onChangeDraftAbout((prev) => ({ ...prev, noiDungHtml: html }))}
              minHeightClass="min-h-[360px]"
            />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[#E3DAC3] pt-4">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] px-4 py-2 text-sm font-semibold text-[#137A6F] hover:bg-[#DCEFEA]"
        >
          <Eye className="h-4 w-4" />
          <span>Xem trước</span>
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSaveAbout('draft')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-[#C9962E] bg-[#F6EBCB] px-4 py-2 text-sm font-semibold text-[#8A6414] hover:bg-[#E2B857]/40 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          <span>Lưu nháp</span>
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSaveAbout('published')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-6 py-2 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-[#E2B857]" />}
          <span>Đăng trang Giới thiệu</span>
        </button>
      </div>
    </div>
  );
}
