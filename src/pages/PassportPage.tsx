import { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Lock,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { DANH_HIEU, STATIONS, type TramDiSan } from '../data';
import {
  formatShortDateVi,
  getCompletedCount,
  getCurrentRank,
  type PassportProgress,
} from '../lib/storage';
import { PassportStamp } from '../components/PassportStamp';

interface PassportPageProps {
  progress: PassportProgress;
  onNavigate: (hash: string) => void;
  onResetPassport: () => void;
  stations?: TramDiSan[];
}

export function PassportPage({
  progress,
  onNavigate,
  onResetPassport,
  stations = STATIONS,
}: PassportPageProps) {
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const completedCount = getCompletedCount(progress, stations);
  const currentRank = getCurrentRank(completedCount);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 pb-16 sm:px-6 sm:py-10">
      {/* Khối Sổ sưu tầm con dấu: gradient xanh ngọc đậm #0B3D3A -> #115E56 + họa tiết 6% */}
      <section className="relative overflow-hidden rounded-[16px] border border-[#E2B857]/40 bg-gradient-to-br from-[#0B3D3A] to-[#115E56] p-6 text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.16)] sm:p-8">
        <div
          className="heritage-pattern-overlay pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E2B857]">
              <Compass className="h-4 w-4" />
              <span>Hộ chiếu điện tử · Bảo tàng Khoa học Số</span>
            </div>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#FBF8F1] sm:text-4xl">
              Sổ Sưu Tầm Con Dấu Di Sản
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[#FBF8F1]/90">
              Hoàn thành thử thách khoa học tại mỗi trạm (từ 60% trở lên) để đóng dấu xác nhận và mở khóa danh hiệu cao quý.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 rounded-[16px] border border-[#E2B857]/45 bg-[#0B3D3A]/65 p-4 backdrop-blur-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#FBF8F1]/85">
                Con dấu
              </div>
              <div className="mt-0.5 font-serif text-2xl font-bold text-[#E2B857] tabular-nums">
                {completedCount}/{stations.length}
              </div>
            </div>
            <div className="h-9 w-px bg-[#E2B857]/35" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#FBF8F1]/85">
                Điểm tích lũy
              </div>
              <div className="mt-0.5 font-serif text-2xl font-bold text-[#E2B857] tabular-nums">
                {progress.totalPoints}
              </div>
            </div>
            <div className="h-9 w-px bg-[#E2B857]/35" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#FBF8F1]/85">
                Danh hiệu
              </div>
              <div className="mt-0.5 text-sm font-bold text-[#FBF8F1]">
                {currentRank ? currentRank.ten : 'Tân du khách'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rank Milestones */}
      <section aria-labelledby="ranks-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="ranks-heading" className="font-serif text-xl font-bold text-[#17262B] sm:text-2xl">
            Hệ thống danh hiệu theo tiến độ
          </h2>
          <span className="text-xs font-medium text-[#4A5B60] tabular-nums">
            Đã mở {DANH_HIEU.filter((d) => completedCount >= d.mocTram).length}/3 danh hiệu
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {DANH_HIEU.map((rank) => {
            const unlocked = completedCount >= rank.mocTram;
            return (
              <div
                key={rank.id}
                className={`rounded-[16px] border p-4 transition-all ${
                  unlocked
                    ? 'border-[#C9962E] bg-[#F6EBCB] shadow-[0_8px_24px_rgba(11,61,58,0.10)]'
                    : 'border-[#E3DAC3] bg-[#F3EDDD]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      unlocked
                        ? 'medal-gold-gradient text-[#0B3D3A] shadow-[0_4px_12px_rgba(201,150,46,0.35)]'
                        : 'border border-[#CBBF9F] bg-[#E3DAC3]/60 text-[#A99C7A]'
                    }`}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${
                      unlocked
                        ? 'bg-[#FBF8F1] text-[#8A6414]'
                        : 'bg-[#FBF8F1]/70 text-[#4A5B60]'
                    }`}
                  >
                    {rank.mocTram}/12 trạm
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-lg font-bold text-[#17262B]">
                  {rank.ten}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5B60]">
                  {rank.moTa}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[#2E8B57]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đã đạt danh hiệu
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#8A6414] tabular-nums">
                      <Lock className="h-3.5 w-3.5 text-[#A99C7A]" />
                      Còn thiếu {rank.mocTram - completedCount} trạm
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12-Slot Stamp Grid */}
      <section aria-labelledby="stamps-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="stamps-heading" className="font-serif text-xl font-bold text-[#17262B] sm:text-2xl">
            Bộ 12 con dấu trạm di sản
          </h2>
          <p className="text-xs text-[#4A5B60]">
            Chạm vào từng ô để mở trang kiến thức và thử thách của trạm
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {stations.map((station) => {
            const record = progress.completedStations[station.id];
            const isCompleted = Boolean(record?.completed);

            return (
              <button
                key={station.id}
                type="button"
                onClick={() => onNavigate(`#/tram/${station.id}`)}
                className={`group flex flex-col items-center justify-between rounded-[16px] border p-4 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#0B3D3A] ${
                  isCompleted
                    ? 'border-[#C9962E] bg-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.10)] hover:-translate-y-0.5'
                    : 'border-dashed border-[#CBBF9F] bg-[#F3EDDD] hover:border-[#137A6F] hover:bg-[#FBF8F1]'
                }`}
              >
                <div className="flex w-full items-center justify-between text-[11px] font-semibold text-[#4A5B60]">
                  <span className="tabular-nums">Trạm {station.id}</span>
                  {isCompleted ? (
                    <span className="text-[#2E8B57] tabular-nums">
                      {record.bestScorePercent}%
                    </span>
                  ) : (
                    <span>Chưa mở</span>
                  )}
                </div>

                {/* Stamp or Locked Ring */}
                <div className="my-3 flex h-28 items-center justify-center">
                  {isCompleted ? (
                    <PassportStamp
                      stationCode={station.id}
                      clusterId={station.cumId}
                      dateLabel={formatShortDateVi(record.stampedAt)}
                      size="md"
                    />
                  ) : (
                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-[#CBBF9F] bg-[#FBF8F1]/80 text-[#A99C7A] transition-colors group-hover:border-[#137A6F] group-hover:text-[#137A6F]">
                      <Lock className="h-6 w-6" strokeWidth={1.8} />
                      <span className="mt-1 font-serif text-sm font-bold tabular-nums">
                        {station.id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-[#17262B] group-hover:text-[#0B3D3A]">
                    {station.ten}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#137A6F]">
                    <span>{isCompleted ? 'Xem lại trạm' : 'Khám phá ngay'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Reset Passport Section */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold text-[#17262B]">Quản lý dữ liệu hộ chiếu</h3>
          <p className="mt-0.5 text-xs text-[#4A5B60]">
            Tiến độ đóng dấu được lưu tự động trên trình duyệt thiết bị của bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-[#C2553A]/40 bg-[#FBE9E3] px-4 py-2 text-xs font-semibold text-[#C2553A] transition-colors hover:bg-[#C2553A] hover:text-[#FBF8F1] active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Đặt lại hộ chiếu</span>
        </button>
      </section>

      {/* In-app Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B3D3A]/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
        >
          <div className="w-full max-w-md rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-6 shadow-[0_8px_24px_rgba(11,61,58,0.20)]">
            <div className="flex items-center gap-3 text-[#C2553A]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#FBE9E3]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 id="reset-dialog-title" className="font-serif text-xl font-bold text-[#17262B]">
                Xác nhận đặt lại hộ chiếu?
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4A5B60]">
              Toàn bộ <strong className="text-[#17262B]">{completedCount} con dấu</strong> và{' '}
              <strong className="text-[#17262B]">{progress.totalPoints} điểm tích lũy</strong> trên thiết bị này sẽ được xóa để bắt đầu hành trình mới từ đầu.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] border-[1.5px] border-[#137A6F] bg-transparent px-5 py-2 text-sm font-semibold text-[#137A6F] hover:bg-[#DCEFEA]/50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetPassport();
                  setConfirmResetOpen(false);
                }}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] bg-[#C2553A] px-5 py-2 text-sm font-semibold text-[#FBF8F1] hover:opacity-90"
              >
                Xác nhận đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
