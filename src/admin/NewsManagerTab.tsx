import { Suspense, lazy } from 'react';
import { Eye, EyeOff, Loader2, Newspaper, Plus, Save, Send, Trash2 } from 'lucide-react';
import type { NewsPost } from '../data';
import { ChemTextField } from './ChemTextField';
import { CoverImageField } from './CoverImageField';
import { INPUT_CLASS, LABEL_CLASS } from './adminUtils';

const LazyRichTextEditor = lazy(() => import('./RichTextEditor'));

interface NewsManagerTabProps {
  newsPosts: NewsPost[];
  selectedNewsId: string;
  draftNews: NewsPost | null;
  isNewNewsPost: boolean;
  newsDirty: boolean;
  saving: boolean;
  onSelectPost: (post: NewsPost) => void;
  onCreatePost: () => void;
  onToggleVisibility: (post: NewsPost) => void;
  onRequestDelete: (post: NewsPost) => void;
  onChangeDraftNews: (updater: (prev: NewsPost | null) => NewsPost | null) => void;
  onPreview: () => void;
  onSavePost: (status: 'draft' | 'published') => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export function NewsManagerTab({
  newsPosts,
  selectedNewsId,
  draftNews,
  isNewNewsPost,
  newsDirty,
  saving,
  onSelectPost,
  onCreatePost,
  onToggleVisibility,
  onRequestDelete,
  onChangeDraftNews,
  onPreview,
  onSavePost,
  onNotify,
}: NewsManagerTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-4 xl:col-span-4">
        <div className="rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-4 shadow-[0_8px_24px_rgba(11,61,58,0.08)]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17262B]">
              Bài viết Tin tức ({newsPosts.length})
            </span>
            <button
              type="button"
              onClick={onCreatePost}
              className="inline-flex items-center gap-1 rounded-[10px] bg-[#0B3D3A] px-3 py-1.5 text-xs font-bold text-[#FBF8F1] hover:bg-[#137A6F]"
            >
              <Plus className="h-3.5 w-3.5 text-[#E2B857]" />
              <span>Thêm bài viết</span>
            </button>
          </div>

          <div className="max-h-[650px] space-y-2.5 overflow-y-auto pr-0.5">
            {newsPosts.map((post) => {
              const isSelected = !isNewNewsPost && post.id === selectedNewsId;
              return (
                <div
                  key={post.id}
                  className={`rounded-[12px] border p-3 transition-all ${
                    isSelected
                      ? 'border-[#0B3D3A] bg-[#0B3D3A] text-[#FBF8F1]'
                      : 'border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F]'
                  }`}
                >
                  <button type="button" onClick={() => onSelectPost(post)} className="w-full text-left">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          post.status === 'published'
                            ? isSelected
                              ? 'bg-[#E4F4EA] text-[#2E8B57]'
                              : 'bg-[#2E8B57]/20 text-[#2E8B57]'
                            : 'bg-[#F6EBCB] text-[#8A6414]'
                        }`}
                      >
                        {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          post.visible ? 'bg-[#DCEFEA] text-[#0B3D3A]' : 'bg-[#FBE9E3] text-[#C2553A]'
                        }`}
                      >
                        {post.visible ? 'Đang hiện' : 'Đang ẩn'}
                      </span>
                      <span className={isSelected ? 'text-[#DCEFEA]' : 'text-[#4A5B60]'}>
                        {post.ngayDang}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug">{post.tieuDe}</p>
                  </button>

                  <div
                    className={`mt-2.5 flex items-center justify-end gap-2 border-t pt-2 ${
                      isSelected ? 'border-[#FBF8F1]/15' : 'border-[#E3DAC3]/70'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(post)}
                      className={`inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-semibold ${
                        isSelected
                          ? 'bg-[#137A6F] text-[#FBF8F1] hover:bg-[#C9962E] hover:text-[#0B3D3A]'
                          : 'bg-[#F3EDDD] text-[#17262B] hover:bg-[#DCEFEA]'
                      }`}
                    >
                      {post.visible ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Ẩn bài</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Hiện bài</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onRequestDelete(post)}
                      className="inline-flex items-center gap-1 rounded-[8px] bg-[#FBE9E3] px-2.5 py-1 text-[11px] font-semibold text-[#C2553A] hover:bg-[#C2553A] hover:text-[#FBF8F1]"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-8 xl:col-span-8">
        {!draftNews ? (
          <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-10 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-[#137A6F]" />
            <h2 className="mt-3 font-serif text-xl font-bold text-[#17262B]">Chưa có bài viết nào được chọn</h2>
            <p className="mt-1.5 text-sm text-[#4A5B60]">
              Hãy chọn một bài viết ở danh sách bên trái hoặc bấm &quot;Thêm bài viết&quot;.
            </p>
            <button
              type="button"
              onClick={onCreatePost}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2.5 text-sm font-bold text-[#FBF8F1]"
            >
              <Plus className="h-4 w-4 text-[#E2B857]" />
              <span>Tạo bài viết mới</span>
            </button>
          </div>
        ) : (
          <div className="passport-frame space-y-5 rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DAC3] pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A6414]">
                  {isNewNewsPost ? 'Soạn bài viết mới' : `Chỉnh sửa bài: ${draftNews.id}`}
                </span>
                <h2 className="font-serif text-xl font-bold text-[#17262B]">Nội dung bài viết Tin tức</h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    draftNews.status === 'published' ? 'bg-[#E4F4EA] text-[#2E8B57]' : 'bg-[#F6EBCB] text-[#8A6414]'
                  }`}
                >
                  {draftNews.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                </span>
                {newsDirty && (
                  <span className="rounded-full bg-[#FBE9E3] px-2.5 py-1 text-xs font-semibold text-[#C2553A]">
                    Chưa lưu
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Tiêu đề bài viết</label>
                <ChemTextField
                  value={draftNews.tieuDe}
                  maxLength={220}
                  placeholder="Nhập tiêu đề bài viết..."
                  onChange={(nextVal) => onChangeDraftNews((prev) => (prev ? { ...prev, tieuDe: nextVal } : prev))}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Danh mục</label>
                <input
                  type="text"
                  value={draftNews.danhMuc}
                  maxLength={80}
                  placeholder="Hoạt động dự án / Khoa học di sản..."
                  onChange={(e) => onChangeDraftNews((prev) => (prev ? { ...prev, danhMuc: e.target.value } : prev))}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Tác giả</label>
                <input
                  type="text"
                  value={draftNews.tacGia}
                  maxLength={120}
                  onChange={(e) => onChangeDraftNews((prev) => (prev ? { ...prev, tacGia: e.target.value } : prev))}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Ngày đăng</label>
                <input
                  type="date"
                  value={draftNews.ngayDang}
                  onChange={(e) => onChangeDraftNews((prev) => (prev ? { ...prev, ngayDang: e.target.value } : prev))}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="flex items-end">
                <label className="flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD] px-3.5 py-2 text-sm font-semibold text-[#17262B]">
                  <span>Hiển thị bài viết (Ẩn / Hiện)</span>
                  <input
                    type="checkbox"
                    checked={draftNews.visible}
                    onChange={(e) => onChangeDraftNews((prev) => (prev ? { ...prev, visible: e.target.checked } : prev))}
                    className="h-4 w-4 accent-[#137A6F]"
                  />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Tóm tắt ngắn</label>
                <ChemTextField
                  multiline
                  rows={2}
                  value={draftNews.tomTat}
                  maxLength={600}
                  onChange={(nextVal) => onChangeDraftNews((prev) => (prev ? { ...prev, tomTat: nextVal } : prev))}
                  className={INPUT_CLASS}
                />
              </div>

              <CoverImageField
                label="Ảnh bìa bài viết (link hoặc tải lên <300KB)"
                value={draftNews.anhBia}
                alt={draftNews.tieuDe || 'Ảnh bìa'}
                onChange={(nextAnhBia) => onChangeDraftNews((prev) => (prev ? { ...prev, anhBia: nextAnhBia } : prev))}
                onNotify={onNotify}
                successToastText="Đã nén ảnh bìa bài viết dưới 300KB."
              />

              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Nội dung bài viết (Trình soạn thảo trực quan)</label>
                <Suspense fallback={<div className="flex h-48 items-center justify-center rounded-[14px] border border-[#E3DAC3] bg-[#F3EDDD] text-xs font-semibold text-[#4A5B60]"><Loader2 className="mr-2 h-4 w-4 animate-spin text-[#137A6F]" />Đang tải trình soạn thảo...</div>}>
                  <LazyRichTextEditor
                    value={draftNews.noiDungHtml}
                    onChange={(html) => onChangeDraftNews((prev) => (prev ? { ...prev, noiDungHtml: html } : prev))}
                    minHeightClass="min-h-[320px]"
                  />
                </Suspense>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[#E3DAC3] pt-4">
              <button type="button" onClick={onPreview} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] px-4 py-2 text-sm font-semibold text-[#137A6F] hover:bg-[#DCEFEA]">
                <Eye className="h-4 w-4" />
                <span>Xem trước</span>
              </button>
              <button type="button" disabled={saving} onClick={() => onSavePost('draft')} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-[#C9962E] bg-[#F6EBCB] px-4 py-2 text-sm font-semibold text-[#8A6414] hover:bg-[#E2B857]/40 disabled:opacity-60">
                <Save className="h-4 w-4" />
                <span>Lưu nháp</span>
              </button>
              <button type="button" disabled={saving} onClick={() => onSavePost('published')} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-6 py-2 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F] disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-[#E2B857]" />}
                <span>Đăng bài viết</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
