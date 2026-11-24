import { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Newspaper, Tag, User } from 'lucide-react';
import type { NewsPost } from '../data';
import { ChemText, RichHtmlWithChem } from '../lib/chem';
import { StationImage } from '../components/StationImage';

interface NewsPageProps {
  posts: NewsPost[];
  postId?: string;
  previewPost?: NewsPost;
  onNavigate: (hash: string) => void;
}

function formatDateVi(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function NewsPage({
  posts,
  postId,
  previewPost,
  onNavigate,
}: NewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const publicPosts = useMemo(
    () => posts.filter((p) => p.status === 'published' && p.visible),
    [posts]
  );

  const activePost = previewPost
    ? previewPost
    : postId
    ? publicPosts.find((p) => p.id === postId)
    : undefined;

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(publicPosts.map((p) => p.danhMuc.trim()).filter(Boolean))
    );
    return ['Tất cả', ...unique];
  }, [publicPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'Tất cả') return publicPosts;
    return publicPosts.filter((p) => p.danhMuc.trim() === selectedCategory);
  }, [publicPosts, selectedCategory]);

  // Article Detail View (or Admin single-article Preview)
  if (postId || previewPost) {
    if (!activePost) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-8 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-[#137A6F]" />
            <h1 className="mt-4 font-serif text-2xl font-bold text-[#17262B]">
              Bài viết không khả dụng
            </h1>
            <p className="mt-2 text-sm text-[#4A5B60]">
              Bài viết này hiện không tồn tại hoặc đang được tạm ẩn bởi quản trị viên.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('#/tin-tuc')}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2.5 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F]"
            >
              <ArrowLeft className="h-4 w-4 text-[#E2B857]" />
              <span>Quay lại danh sách Tin tức</span>
            </button>
          </div>
        </div>
      );
    }

    const relatedPosts = publicPosts
      .filter((p) => p.id !== activePost.id)
      .slice(0, 2);

    return (
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 pb-16 sm:px-6">
        {!previewPost && (
          <button
            type="button"
            onClick={() => onNavigate('#/tin-tuc')}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-[12px] border border-[#E3DAC3] bg-[#FBF8F1] px-3.5 py-2 text-xs font-semibold text-[#0B3D3A] transition-colors hover:border-[#137A6F] hover:bg-[#DCEFEA]/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả bài viết Tin tức</span>
          </button>
        )}

        <article className="passport-frame overflow-hidden rounded-[16px] bg-[#FBF8F1]">
          {activePost.anhBia && (
            <div className="relative h-56 w-full overflow-hidden bg-[#0B3D3A] sm:h-80">
              <StationImage
                src={activePost.anhBia}
                alt={activePost.tieuDe}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A]/60 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#DCEFEA] px-3 py-1 font-semibold text-[#0B3D3A]">
                <Tag className="h-3 w-3 text-[#137A6F]" />
                {activePost.danhMuc || 'Tin tức'}
              </span>
              <span className="inline-flex items-center gap-1 text-[#4A5B60]">
                <Calendar className="h-3.5 w-3.5 text-[#8A6414]" />
                {formatDateVi(activePost.ngayDang)}
              </span>
              {activePost.tacGia && (
                <span className="inline-flex items-center gap-1 text-[#4A5B60]">
                  <User className="h-3.5 w-3.5 text-[#137A6F]" />
                  {activePost.tacGia}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold leading-snug text-[#17262B] sm:text-3xl">
              <ChemText text={activePost.tieuDe} />
            </h1>

            {activePost.tomTat && (
              <p className="mt-3 rounded-[12px] border-l-4 border-[#C9962E] bg-[#F3EDDD] px-4 py-3 text-sm font-medium leading-relaxed text-[#17262B]">
                <ChemText text={activePost.tomTat} />
              </p>
            )}

            <div className="my-6 h-px bg-[#E3DAC3]" />

            <RichHtmlWithChem html={activePost.noiDungHtml} />
          </div>
        </article>

        {!previewPost && relatedPosts.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#17262B]">
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedPosts.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onNavigate(`#/tin-tuc/${rel.id}`)}
                  className="flex flex-col overflow-hidden rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] text-left shadow-[0_8px_24px_rgba(11,61,58,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#137A6F]"
                >
                  {rel.anhBia && (
                    <div className="h-36 w-full overflow-hidden bg-[#F3EDDD]">
                      <StationImage
                        src={rel.anhBia}
                        alt={rel.tieuDe}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A6414]">
                      {rel.danhMuc} · {formatDateVi(rel.ngayDang)}
                    </span>
                    <h3 className="mt-1 font-serif text-base font-bold text-[#17262B] line-clamp-2">
                      {rel.tieuDe}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // News List View
  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#0B3D3A] text-[#FBF8F1]">
        <div
          aria-hidden="true"
          className="heritage-pattern-overlay pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B857]/40 bg-[#0B3D3A]/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#E2B857]">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Bản tin Di sản &amp; Khoa học</span>
          </div>
          <h1 className="mt-3 font-serif text-2xl font-bold text-[#FBF8F1] sm:text-4xl">
            Tin tức &amp; Hoạt động STEM
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#DCEFEA]">
            Cập nhật câu chuyện khoa học phía sau 12 trạm di sản, hoạt động trải nghiệm và các ghi chép nghiên cứu mới nhất của dự án.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[38px] rounded-[10px] border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'border-[#0B3D3A] bg-[#0B3D3A] text-[#FBF8F1]'
                      : 'border-[#E3DAC3] bg-[#FBF8F1] text-[#4A5B60] hover:border-[#137A6F] hover:text-[#0B3D3A]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-10 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-[#137A6F]" />
            <h2 className="mt-3 font-serif text-xl font-bold text-[#17262B]">
              Chưa có bài viết nào được đăng
            </h2>
            <p className="mt-1.5 text-sm text-[#4A5B60]">
              Các bài viết tin tức và hoạt động STEM mới sẽ sớm được cập nhật tại đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onNavigate(`#/tin-tuc/${post.id}`)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#137A6F] hover:shadow-[0_12px_28px_rgba(11,61,58,0.14)]"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[#F3EDDD]">
                  {post.anhBia ? (
                    <StationImage
                      src={post.anhBia}
                      alt={post.tieuDe}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#DCEFEA] text-[#0B3D3A]">
                      <Newspaper className="h-10 w-10 opacity-40" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-[#0B3D3A]/90 px-3 py-1 text-[11px] font-semibold text-[#E2B857] backdrop-blur-sm">
                    {post.danhMuc || 'Tin tức'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-[#4A5B60]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#8A6414]" />
                      {formatDateVi(post.ngayDang)}
                    </span>
                    {post.tacGia && (
                      <span className="truncate">· {post.tacGia}</span>
                    )}
                  </div>

                  <h2 className="mt-2 font-serif text-lg font-bold leading-snug text-[#17262B] group-hover:text-[#0B3D3A] line-clamp-2">
                    <ChemText text={post.tieuDe} />
                  </h2>

                  {post.tomTat && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4A5B60] line-clamp-3">
                      <ChemText text={post.tomTat} />
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#E3DAC3]/70">
                    <span className="text-xs font-bold text-[#137A6F] group-hover:text-[#0B3D3A]">
                      Đọc bài viết →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
