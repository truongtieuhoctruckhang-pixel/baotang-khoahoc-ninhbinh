import { Eye, X } from 'lucide-react';
import type { AboutPageData, CumTram, NewsPost, ProjectInfo, TramDiSan } from '../data';
import type { AdminTab } from '../lib/routes';
import type { PassportProgress } from '../lib/storage';
import { StationImage } from '../components/StationImage';
import { AboutPage } from '../pages/AboutPage';
import { NewsPage } from '../pages/NewsPage';
import { StationPage } from '../pages/StationPage';

interface AdminModalsProps {
  confirmSeedOpen: boolean;
  onCancelSeed: () => void;
  onConfirmSeed: () => void;
  deleteNewsTarget: NewsPost | null;
  onCancelDeleteNews: () => void;
  onConfirmDeleteNews: () => void;
  previewKind: AdminTab | null;
  onClosePreview: () => void;
  previewStation: TramDiSan | null;
  stations: TramDiSan[];
  draftClusters: CumTram[];
  draftProject: ProjectInfo;
  draftAbout: AboutPageData;
  draftNews: NewsPost | null;
  newsPosts: NewsPost[];
  progress: PassportProgress;
}

export function AdminModals({
  confirmSeedOpen,
  onCancelSeed,
  onConfirmSeed,
  deleteNewsTarget,
  onCancelDeleteNews,
  onConfirmDeleteNews,
  previewKind,
  onClosePreview,
  previewStation,
  stations,
  draftClusters,
  draftProject,
  draftAbout,
  draftNews,
  newsPosts,
  progress,
}: AdminModalsProps) {
  return (
    <>
      {confirmSeedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B3D3A]/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-6 shadow-[0_8px_24px_rgba(11,61,58,0.22)]">
            <h3 className="font-serif text-xl font-bold text-[#17262B]">Xác nhận nạp dữ liệu mẫu lên Firebase?</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[#4A5B60]">
              Thao tác này sẽ đẩy toàn bộ dữ liệu mặc định (12 trạm, Trang chủ, Trang Giới thiệu và các bài Tin tức mẫu) lên Firestore và <strong>ghi đè dữ liệu hiện có</strong>. Bạn nên bấm <strong>Xuất dữ liệu (JSON)</strong> trước nếu muốn giữ bản sao lưu.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancelSeed} className="inline-flex min-h-[42px] items-center justify-center rounded-[12px] border border-[#E3DAC3] px-4 py-2 text-sm font-semibold text-[#4A5B60] hover:bg-[#F3EDDD]">
                Hủy
              </button>
              <button type="button" onClick={onConfirmSeed} className="inline-flex min-h-[42px] items-center justify-center rounded-[12px] bg-[#C9962E] px-5 py-2 text-sm font-bold text-[#0B3D3A] hover:bg-[#E2B857]">
                Đồng ý nạp dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteNewsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B3D3A]/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-6 shadow-[0_8px_24px_rgba(11,61,58,0.22)]">
            <h3 className="font-serif text-xl font-bold text-[#17262B]">Xóa bài viết Tin tức?</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[#4A5B60]">
              Bạn chắc chắn muốn xóa bài viết <strong>&quot;{deleteNewsTarget.tieuDe}&quot;</strong>? Thao tác này không thể hoàn tác.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancelDeleteNews} className="inline-flex min-h-[42px] items-center justify-center rounded-[12px] border border-[#E3DAC3] px-4 py-2 text-sm font-semibold text-[#4A5B60] hover:bg-[#F3EDDD]">
                Hủy
              </button>
              <button type="button" onClick={onConfirmDeleteNews} className="inline-flex min-h-[42px] items-center justify-center rounded-[12px] bg-[#C2553A] px-5 py-2 text-sm font-bold text-[#FBF8F1] hover:opacity-90">
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}

      {previewKind && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0B3D3A]/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Xem trước nội dung">
          <div className="flex items-center justify-between border-b border-[#E3DAC3] bg-[#0B3D3A] px-4 py-3 text-[#FBF8F1] sm:px-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Eye className="h-4 w-4 text-[#E2B857]" />
              <span>
                {previewKind === 'stations' && previewStation
                  ? `Xem trước Trạm ${previewStation.id}: ${previewStation.ten}`
                  : previewKind === 'news' && draftNews
                  ? `Xem trước bài viết: ${draftNews.tieuDe || 'Chưa có tiêu đề'}`
                  : previewKind === 'about'
                  ? 'Xem trước Trang Giới thiệu'
                  : 'Xem trước Trang chủ & 3 Cụm'}
              </span>
            </div>
            <button type="button" onClick={onClosePreview} className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[10px] bg-[#137A6F] px-3.5 py-1.5 text-xs font-bold text-[#FBF8F1] hover:bg-[#C9962E] hover:text-[#0B3D3A]">
              <X className="h-4 w-4" />
              <span>Đóng xem trước</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#FBF8F1]">
            {previewKind === 'stations' && previewStation && (
              <StationPage
                key={`${previewStation.id}-${previewStation.video.youtubeId}-${Boolean(previewStation.autoplay)}`}
                station={previewStation}
                stations={stations}
                clusters={draftClusters}
                progress={progress}
                previewMode
                onNavigate={() => {}}
                onCompleteQuiz={() => ({ passed: true, newlyStamped: false })}
              />
            )}

            {previewKind === 'news' && draftNews && (
              <NewsPage posts={newsPosts} previewPost={draftNews} onNavigate={() => {}} />
            )}

            {previewKind === 'about' && (
              <AboutPage aboutPage={draftAbout} projectInfo={draftProject} previewMode onNavigate={() => {}} />
            )}

            {previewKind === 'home' && (
              <div className="mx-auto max-w-5xl space-y-8 p-6">
                <div className="relative overflow-hidden rounded-[20px] bg-[#0B3D3A] text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.18)]">
                  <StationImage src={draftProject.anhBia} alt={draftProject.tenDuAn} className="h-72 w-full object-cover opacity-45" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0B3D3A] via-[#0B3D3A]/60 to-transparent p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E2B857]">{draftProject.tenPhu}</p>
                    <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{draftProject.tenDuAn}</h2>
                    <p className="mt-2 max-w-2xl text-sm text-[#DCEFEA]">{draftProject.khauHieu}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {draftClusters.map((c) => (
                    <div key={c.id} className="rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-4" style={{ borderTop: `4px solid ${c.mauDau}` }}>
                      <span className="text-xs font-bold uppercase text-[#8A6414]">{c.soThuTu}</span>
                      <h3 className="mt-1 font-serif text-lg font-bold text-[#17262B]">{c.ten}</h3>
                      <p className="text-xs font-semibold text-[#137A6F]">{c.chuDe}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[#4A5B60]">{c.moTa}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
