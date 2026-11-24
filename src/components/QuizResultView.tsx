import { ArrowRight, Award, BookMarked, RotateCcw } from 'lucide-react';
import type { TramDiSan } from '../data';
import { PassportStamp } from './PassportStamp';

interface QuizResultViewProps {
  station: TramDiSan;
  correctCount: number;
  totalQuestions: number;
  passedResult: boolean;
  isNewlyStamped: boolean;
  alreadyCompleted: boolean;
  onRetry: () => void;
  onGoToPassport: () => void;
  onGoToNextStation?: () => void;
}

export function QuizResultView({
  station,
  correctCount,
  totalQuestions,
  passedResult,
  isNewlyStamped,
  alreadyCompleted,
  onRetry,
  onGoToPassport,
  onGoToNextStation,
}: QuizResultViewProps) {
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const pointsText = passedResult ? (scorePercent === 100 ? '+120 điểm' : '+100 điểm') : '0 điểm';

  return (
    <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        {passedResult ? (
          <>
            <div className="mb-4">
              <PassportStamp
                stationCode={station.id}
                clusterId={station.cumId}
                dateLabel="ĐẠT CHUẨN STEM"
                size="lg"
                animate
              />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#17262B] sm:text-3xl">
              {isNewlyStamped
                ? 'Chúc mừng! Đã đóng dấu trạm'
                : alreadyCompleted
                ? 'Hoàn thành xuất sắc thử thách'
                : 'Đã đóng dấu thành công'}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4A5B60]">
              Bạn đã trả lời đúng{' '}
              <strong className="font-semibold text-[#2E8B57] tabular-nums">
                {correctCount}/{totalQuestions} câu ({scorePercent}%)
              </strong>
              . Con dấu Trạm {station.id} đã được lưu vào Hộ chiếu Khoa học của bạn.
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE9E3] text-[#C2553A]">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#17262B]">
              Chưa đủ điều kiện đóng dấu
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4A5B60]">
              Bạn đạt{' '}
              <strong className="font-semibold text-[#C2553A] tabular-nums">
                {correctCount}/{totalQuestions} câu ({scorePercent}%)
              </strong>
              . Cần đạt tối thiểu <strong className="text-[#17262B]">60%</strong> để đóng dấu xác nhận trạm này. Hãy thử lại nhé!
            </p>
          </>
        )}

        <div className="mt-6 grid w-full max-w-md grid-cols-3 divide-x divide-[#E3DAC3] rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] py-3">
          <div className="px-2">
            <div className="text-[11px] font-medium text-[#4A5B60]">Số câu đúng</div>
            <div className="mt-0.5 text-lg font-bold text-[#17262B] tabular-nums">
              {correctCount}/{totalQuestions}
            </div>
          </div>
          <div className="px-2">
            <div className="text-[11px] font-medium text-[#4A5B60]">Tỷ lệ</div>
            <div
              className={`mt-0.5 text-lg font-bold tabular-nums ${
                passedResult ? 'text-[#2E8B57]' : 'text-[#C2553A]'
              }`}
            >
              {scorePercent}%
            </div>
          </div>
          <div className="px-2">
            <div className="text-[11px] font-medium text-[#4A5B60]">Điểm tích lũy</div>
            <div className="mt-0.5 text-lg font-bold text-[#8A6414] tabular-nums">
              {pointsText}
            </div>
          </div>
        </div>

        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#137A6F] transition-colors hover:bg-[#DCEFEA]/50 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Làm lại thử thách</span>
          </button>

          <button
            type="button"
            onClick={onGoToPassport}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2.5 text-sm font-semibold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.10)] transition-colors hover:bg-[#137A6F] active:scale-[0.98]"
          >
            <BookMarked className="h-4 w-4 text-[#E2B857]" />
            <span>Xem Hộ chiếu</span>
          </button>
        </div>

        {onGoToNextStation && (
          <button
            type="button"
            onClick={onGoToNextStation}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#137A6F] transition-colors hover:text-[#0B3D3A]"
          >
            <span>Khám phá trạm tiếp theo</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
