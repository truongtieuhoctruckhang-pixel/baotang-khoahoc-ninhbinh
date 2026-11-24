import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { TramDiSan } from '../data';

interface StationPrevNextNavProps {
  prevStation: TramDiSan | null;
  nextStation: TramDiSan | null;
  onNavigate: (hash: string) => void;
}

export function StationPrevNextNav({
  prevStation,
  nextStation,
  onNavigate,
}: StationPrevNextNavProps) {
  return (
    <nav
      aria-label="Chuyển trạm liền kề"
      className="grid grid-cols-1 gap-3 border-t border-[#E3DAC3] pt-6 sm:grid-cols-2"
    >
      {prevStation ? (
        <button
          type="button"
          onClick={() => onNavigate(`#/tram/${prevStation.id}`)}
          className="flex min-h-[56px] items-center gap-3 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-4 text-left shadow-[0_8px_24px_rgba(11,61,58,0.10)] transition-colors hover:border-[#137A6F]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-[#137A6F]" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#4A5B60]">
              Trạm trước · {prevStation.id}
            </div>
            <div className="truncate font-serif text-sm font-bold text-[#17262B]">
              {prevStation.ten}
            </div>
          </div>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextStation && (
        <button
          type="button"
          onClick={() => onNavigate(`#/tram/${nextStation.id}`)}
          className="flex min-h-[56px] items-center justify-end gap-3 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-4 text-right shadow-[0_8px_24px_rgba(11,61,58,0.10)] transition-colors hover:border-[#137A6F]"
        >
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#4A5B60]">
              Trạm kế tiếp · {nextStation.id}
            </div>
            <div className="truncate font-serif text-sm font-bold text-[#17262B]">
              {nextStation.ten}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#137A6F]" />
        </button>
      )}
    </nav>
  );
}
