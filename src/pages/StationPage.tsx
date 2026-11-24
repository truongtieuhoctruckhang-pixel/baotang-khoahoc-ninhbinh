import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';
import { CLUSTERS, STATIONS, type CumTram, type TramDiSan } from '../data';
import { ChemText } from '../lib/chem';
import { getClusterAccent } from '../lib/clusterTheme';
import type { PassportProgress } from '../lib/storage';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { PassportStamp } from '../components/PassportStamp';
import { QuizEngine } from '../components/QuizEngine';
import { StationImage } from '../components/StationImage';
import { StationPrevNextNav } from '../components/StationPrevNextNav';
import { StationShareModal } from '../components/StationShareModal';
import { YoutubeEmbed } from '../components/YoutubeEmbed';

interface StationPageProps {
  station: TramDiSan;
  progress: PassportProgress;
  onNavigate: (hash: string) => void;
  onCompleteQuiz: (
    stationId: string,
    correctCount: number,
    totalQuestions: number
  ) => { passed: boolean; newlyStamped: boolean; allCompleted?: boolean };
  stations?: TramDiSan[];
  clusters?: CumTram[];
  previewMode?: boolean;
  onQuizActiveChange?: (active: boolean) => void;
}

export function StationPage({
  station,
  progress,
  onNavigate,
  onCompleteQuiz,
  stations = STATIONS,
  clusters = CLUSTERS,
  previewMode = false,
  onQuizActiveChange,
}: StationPageProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGrandFinale, setIsGrandFinale] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const quizSectionRef = useRef<HTMLElement | null>(null);

  const record = progress.completedStations[station.id];
  const isCompleted = Boolean(record?.completed);
  const currentIdx = stations.findIndex((s) => s.id === station.id);
  const prevStation = currentIdx > 0 ? stations[currentIdx - 1] : null;
  const nextStation =
    currentIdx >= 0 && currentIdx < stations.length - 1 ? stations[currentIdx + 1] : null;
  const clusterAccent = getClusterAccent(station.cumId, clusters);

  useEffect(() => {
    setShowQuiz(false);
    setShowConfetti(false);
    setIsGrandFinale(false);
  }, [station.id]);

  useEffect(() => {
    onQuizActiveChange?.(showQuiz);
    return () => {
      onQuizActiveChange?.(false);
    };
  }, [showQuiz, onQuizActiveChange]);

  const handleOpenQuiz = () => {
    setShowQuiz(true);
    setTimeout(() => {
      quizSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleNotify = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuizFinish = (correctCount: number, totalQuestions: number) => {
    const res = onCompleteQuiz(station.id, correctCount, totalQuestions);
    if (res.passed) {
      setIsGrandFinale(Boolean(res.allCompleted));
      setShowConfetti(true);
    }
    return { passed: res.passed, newlyStamped: res.newlyStamped };
  };

  return (
    <div className="pb-16">
      <ConfettiBurst
        active={showConfetti}
        grandFinale={isGrandFinale}
        onComplete={() => {
          setShowConfetti(false);
          setIsGrandFinale(false);
        }}
      />

      {!previewMode && (
        <div
          className="relative z-30 border-b border-[#E3DAC3] bg-[#FBF8F1]/92 backdrop-blur-md md:sticky md:top-0"
          style={{ borderTop: `3px solid ${clusterAccent.color}` }}
        >
          <div className="mx-auto flex h-13 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => onNavigate('#/')}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#17262B] transition-colors hover:text-[#0B3D3A] whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-4 w-4 text-[#137A6F]" />
              <span>Trang chủ</span>
            </button>

            <div className="flex items-center gap-2">
              <div
                className="truncate rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider tabular-nums"
                style={{
                  backgroundColor: clusterAccent.pillBg,
                  color: clusterAccent.textOnLight,
                }}
              >
                Trạm {station.id} / {stations.length}
              </div>

              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#0B3D3A] px-3.5 py-1 text-xs font-bold text-[#FBF8F1] transition-colors hover:bg-[#137A6F] whitespace-nowrap shrink-0 shadow-sm"
                title="Chia sẻ trạm & Mã QR"
              >
                <Share2 className="h-3.5 w-3.5 text-[#E2B857]" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl space-y-8 px-4 pt-5 sm:px-6 sm:pt-8">
        {/* 1. Station Hero Cover */}
        <section className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#0B3D3A] to-[#115E56] text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.16)]">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
            <StationImage
              src={station.anh}
              alt={station.ten}
              loading="eager"
              fallbackLabel={station.ten}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A] via-[#0B3D3A]/60 to-transparent"
              aria-hidden="true"
            />

            {isCompleted && (
              <div className="absolute right-4 top-4 z-10">
                <PassportStamp
                  stationCode={station.id}
                  clusterId={station.cumId}
                  dateLabel="ĐÃ ĐÓNG DẤU"
                  size="md"
                />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-8">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center rounded-full border border-[#E2B857]/45 bg-[#0B3D3A]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E2B857] backdrop-blur-sm">
                  {station.cum}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0B3D3A]/90 px-3 py-1.5 text-xs font-bold text-[#FBF8F1] backdrop-blur-sm border border-[#E2B857]/50 transition-colors hover:bg-[#137A6F]"
                >
                  <Share2 className="h-3.5 w-3.5 text-[#E2B857]" />
                  <span>Chia sẻ / QR</span>
                </button>
              </div>

              <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#FBF8F1] sm:text-4xl">
                <ChemText text={station.ten} />
              </h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#FBF8F1]/95 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#E2B857]" />
                  {station.diaPhuong}
                </span>
                <span aria-hidden="true">·</span>
                <span>{station.kienThuc.linhVuc}</span>
                {isCompleted && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#E2B857]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đã đóng dấu ({record?.bestScorePercent}%)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Scientific Knowledge */}
        <section aria-labelledby="science-knowledge-heading" className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#137A6F]">
            <BookOpen className="h-4 w-4" />
            <h2 id="science-knowledge-heading">Kiến thức khoa học trọng tâm</h2>
          </div>

          <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-7">
            <p className="text-[15px] leading-relaxed text-[#17262B] sm:text-base">
              <ChemText text={station.kienThuc.tomTat} />
            </p>

            <ul className="mt-5 space-y-2.5 border-t border-[#E3DAC3] pt-5">
              {station.kienThuc.diemNhan.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-[#4A5B60]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCEFEA] text-[11px] font-bold text-[#0B3D3A] tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-[#17262B]">
                    <ChemText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[16px] border border-[#C9962E]/50 bg-[#F6EBCB] p-5 shadow-[0_8px_24px_rgba(11,61,58,0.10)] sm:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A6414]">
              <FlaskConical className="h-4 w-4" />
              <span>Phương trình &amp; Quy luật khoa học nổi bật</span>
            </div>

            <div className="mt-3 overflow-x-auto rounded-[12px] border border-[#E3DAC3] bg-[#FBF8F1] px-4 py-4 text-center">
              <div className="inline-flex max-w-full items-center gap-2 font-serif text-base font-bold text-[#17262B] sm:text-xl">
                <Atom className="h-5 w-5 shrink-0 text-[#137A6F]" />
                <ChemText text={station.kienThuc.phuongTrinh} className="min-w-0" />
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#4A5B60] sm:text-sm">
              <ChemText text={station.kienThuc.giaiThichPhuongTrinh} />
            </p>
          </div>
        </section>

        {/* 3. Lazy-loaded 16:9 YouTube Video */}
        <YoutubeEmbed
          stationId={station.id}
          youtubeInput={station.video.youtubeId}
          title={station.video.tieuDe}
          duration={station.video.thoiLuong}
          autoplay={Boolean(station.autoplay)}
        />

        {/* 4. Quiz CTA & Inline Engine */}
        <section ref={quizSectionRef} className="space-y-5">
          {!showQuiz ? (
            <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#0B3D3A] to-[#115E56] p-6 text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.16)] sm:p-8">
              <div
                className="heritage-pattern-overlay pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E2B857]">
                    <Sparkles className="h-4 w-4" />
                    <span>Thử thách đóng dấu trạm {station.id}</span>
                  </div>
                  <h2 className="mt-1.5 font-serif text-2xl font-bold text-[#FBF8F1] sm:text-3xl">
                    {isCompleted ? 'Làm lại thử thách trạm' : 'Sẵn sàng nhận con dấu?'}
                  </h2>
                  <p className="mt-1.5 max-w-lg text-sm text-[#FBF8F1]/90">
                    Trả lời {station.cauHoi.length} câu hỏi trắc nghiệm khoa học. Đạt từ 60% trở lên để nhận con dấu chứng nhận vào hộ chiếu của bạn.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenQuiz}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#C9962E] px-6 py-3 text-sm font-bold text-[#0B3D3A] shadow-[0_8px_24px_rgba(11,61,58,0.18)] transition-all hover:bg-[#E2B857] active:scale-[0.98] sm:w-auto whitespace-nowrap shrink-0"
                >
                  <span>Tham gia thử thách</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#137A6F]">
                <Sparkles className="h-4 w-4" />
                <h2>Thử thách trắc nghiệm · Trạm {station.id}</h2>
              </div>
              <QuizEngine
                station={station}
                alreadyCompleted={isCompleted}
                onQuizFinish={handleQuizFinish}
                onGoToPassport={() => onNavigate('#/ho-chieu')}
                onGoToNextStation={
                  nextStation ? () => onNavigate(`#/tram/${nextStation.id}`) : undefined
                }
              />
            </div>
          )}
        </section>

        {/* 5. Prev / Next Station Footer Navigation */}
        {!previewMode && (
          <StationPrevNextNav
            prevStation={prevStation}
            nextStation={nextStation}
            onNavigate={onNavigate}
          />
        )}
      </div>

      <StationShareModal
        station={station}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onNotify={handleNotify}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[12px] bg-[#17262B] px-4 py-2.5 text-xs font-semibold text-[#FBF8F1] shadow-xl border border-[#E2B857]/45 animate-fade-in flex items-center gap-2">
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
