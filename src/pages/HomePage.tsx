import { useRef } from 'react';
import { ArrowRight, Award, BookMarked, Compass, Sparkles, Users } from 'lucide-react';
import {
  CLUSTERS,
  PROJECT_INFO,
  STATIONS,
  type CumTram,
  type ProjectInfo,
  type TramDiSan,
} from '../data';
import { getClusterAccent } from '../lib/clusterTheme';
import {
  getCompletedCount,
  getCurrentRank,
  getNextRank,
  type PassportProgress,
} from '../lib/storage';
import { JourneyMapSvg } from '../components/JourneyMapSvg';
import { StationCard } from '../components/StationCard';
import { StationImage } from '../components/StationImage';

interface HomePageProps {
  progress: PassportProgress;
  onNavigate: (hash: string) => void;
  projectInfo?: ProjectInfo;
  clusters?: CumTram[];
  stations?: TramDiSan[];
}

export function HomePage({
  progress,
  onNavigate,
  projectInfo = PROJECT_INFO,
  clusters = CLUSTERS,
  stations = STATIONS,
}: HomePageProps) {
  const clustersSectionRef = useRef<HTMLElement | null>(null);
  const completedCount = getCompletedCount(progress, stations);
  const progressPercent = Math.round((completedCount / stations.length) * 100);
  const currentRank = getCurrentRank(completedCount);
  const nextRank = getNextRank(completedCount);

  const handleStartJourney = () => {
    clustersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-12 sm:space-y-16">
      {/* 1. Full-width Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3D3A] to-[#115E56] text-[#FBF8F1]">
        <div className="relative min-h-[430px] sm:min-h-[500px] lg:min-h-[540px]">
          <StationImage
            src={projectInfo.anhBia}
            alt="Di sản Tràng An – Hộ chiếu Du lịch Khoa học 4.0"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A] via-[#0B3D3A]/80 to-[#115E56]/60"
            aria-hidden="true"
          />
          <div
            className="heritage-pattern-overlay pointer-events-none absolute inset-0"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[430px] max-w-6xl flex-col justify-end px-4 py-10 sm:min-h-[500px] sm:px-6 sm:py-14 lg:min-h-[540px]">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E2B857] sm:text-sm">
                {projectInfo.tenPhu}
              </p>
              <h1 className="mt-2.5 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-[#FBF8F1] sm:text-4xl lg:text-5xl">
                {projectInfo.tenDuAn}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#FBF8F1]/90 sm:text-base">
                {projectInfo.khauHieu}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartJourney}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[12px] bg-[#C9962E] px-6 py-3 text-sm font-bold text-[#0B3D3A] shadow-[0_8px_24px_rgba(11,61,58,0.18)] transition-all duration-150 hover:bg-[#E2B857] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B857]"
                >
                  <Compass className="h-4 w-4" />
                  <span>Bắt đầu hành trình</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('#/ho-chieu')}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#E2B857]/75 bg-transparent px-5 py-3 text-sm font-semibold text-[#FBF8F1] backdrop-blur-sm transition-colors hover:bg-[#FBF8F1]/10 active:scale-[0.98]"
                >
                  <BookMarked className="h-4 w-4 text-[#E2B857]" />
                  <span>Mở Hộ chiếu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Passport Progress Card */}
      <section className="relative z-20 mx-auto -mt-14 max-w-6xl px-4 sm:-mt-16 sm:px-6">
        <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#4A5B60]">
                <span className="font-semibold text-[#137A6F]">Tiến độ hộ chiếu số</span>
                <span aria-hidden="true">·</span>
                <span>
                  {currentRank
                    ? `Danh hiệu hiện tại: ${currentRank.ten}`
                    : nextRank
                    ? `Cần ${nextRank.mocTram - completedCount} trạm nữa để đạt "${nextRank.ten}"`
                    : 'Hoàn thành toàn bộ hành trình'}
                </span>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-xl font-bold text-[#17262B] sm:text-2xl tabular-nums">
                  Hộ chiếu của bạn: {completedCount}/{stations.length} trạm
                </h2>
                <span className="text-sm font-bold text-[#137A6F] tabular-nums">
                  {progressPercent}%
                </span>
              </div>

              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#E3DAC3]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#137A6F] to-[#C9962E] transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progressPercent, completedCount > 0 ? 5 : 0)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#E3DAC3] pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div>
                <div className="text-xs font-medium text-[#4A5B60]">Điểm tích lũy</div>
                <div className="mt-0.5 flex items-center gap-1.5 font-serif text-2xl font-bold text-[#17262B] tabular-nums">
                  <Award className="h-5 w-5 text-[#8A6414]" />
                  <span>{progress.totalPoints}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('#/ho-chieu')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] border-[1.5px] border-[#137A6F] bg-transparent px-4 py-2 text-xs font-semibold text-[#137A6F] transition-colors hover:bg-[#DCEFEA] whitespace-nowrap"
              >
                <span>Xem con dấu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Heritage Clusters & 12 Stations */}
      <section ref={clustersSectionRef} className="mx-auto max-w-6xl space-y-12 px-4 sm:space-y-16 sm:px-6">
        {clusters.map((cluster) => {
          const clusterStations = stations.filter((s) => s.cumId === cluster.id);
          const clusterDoneCount = clusterStations.filter(
            (s) => progress.completedStations[s.id]?.completed
          ).length;
          const accent = getClusterAccent(cluster.id, clusters);

          return (
            <div key={cluster.id} className="space-y-6">
              <div className="flex flex-col justify-between gap-3 border-b border-[#E3DAC3] pb-4 sm:flex-row sm:items-end">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 uppercase tracking-wider"
                      style={{ backgroundColor: accent.pillBg, color: accent.textOnLight }}
                    >
                      {cluster.soThuTu} · {cluster.chuDe}
                    </span>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-[#17262B] sm:text-3xl">
                    {cluster.ten}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#4A5B60]">{cluster.moTa}</p>
                </div>

                <div className="text-xs font-semibold text-[#4A5B60] tabular-nums whitespace-nowrap">
                  Hoàn thành:{' '}
                  <span style={{ color: accent.textOnLight }}>
                    {clusterDoneCount}/{clusterStations.length}
                  </span>{' '}
                  trạm
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {clusterStations.map((station, idx) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    index={idx}
                    record={progress.completedStations[station.id]}
                    accentColor={accent.color}
                    textOnLight={accent.textOnLight}
                    onSelect={(id) => onNavigate(`#/tram/${id}`)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Interactive SVG Journey Map Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#137A6F]">
              Lộ trình di sản 4.0
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#17262B] sm:text-3xl">
              Bản đồ hành trình khoa học
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('#/ban-do')}
            className="inline-flex min-h-[40px] items-center gap-1.5 self-start text-sm font-semibold text-[#137A6F] hover:text-[#0B3D3A] hover:underline sm:self-auto"
          >
            <span>Mở bản đồ toàn trang</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <JourneyMapSvg
          progress={progress}
          stations={stations}
          clusters={clusters}
          onSelectStation={(id) => onNavigate(`#/tram/${id}`)}
        />
      </section>

      {/* 5. About the Project Team */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="passport-frame rounded-[16px] bg-[#F3EDDD] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCEFEA] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0B3D3A]">
                <Users className="h-3.5 w-3.5 text-[#137A6F]" />
                <span>Giới thiệu nhóm thực hiện</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold text-[#17262B] sm:text-3xl">
                {projectInfo.nhomThucHien.tenNhom}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#8A6414]">
                {projectInfo.nhomThucHien.donVi}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#4A5B60] sm:text-base">
                {projectInfo.nhomThucHien.gioiThieu}
              </p>
            </div>

            <div className="space-y-3 lg:col-span-5">
              {projectInfo.nhomThucHien.thanhVien.map((tv, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#DCEFEA] text-[#137A6F]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#17262B]">{tv.hoTen}</div>
                    <div className="text-xs text-[#4A5B60]">{tv.vaiTro}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
