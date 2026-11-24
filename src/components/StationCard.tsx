import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import type { TramDiSan } from '../data';
import { ChemText } from '../lib/chem';
import type { StationProgressRecord } from '../lib/storage';
import { PassportStamp } from './PassportStamp';
import { StationImage } from './StationImage';

interface StationCardProps {
  station: TramDiSan;
  index: number;
  record?: StationProgressRecord;
  accentColor: string;
  textOnLight: string;
  onSelect: (stationId: string) => void;
}

export function StationCard({
  station,
  index,
  record,
  accentColor,
  textOnLight,
  onSelect,
}: StationCardProps) {
  const isStamped = Boolean(record?.completed);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
      onClick={() => onSelect(station.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(station.id);
        }
      }}
      style={{ borderTop: `3px solid ${accentColor}` }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] shadow-[0_8px_24px_rgba(11,61,58,0.10)] transition-all duration-200 hover:-translate-y-1 hover:border-[#137A6F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D3A]"
    >
      {/* Thumbnail Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#DCEFEA]">
        <StationImage
          src={station.anh}
          alt={station.ten}
          fallbackLabel={station.ten}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B3D3A]/90 via-[#0B3D3A]/20 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 text-[#FBF8F1]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#E2B857]">
              Trạm {station.id}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-[#FBF8F1]/95">
              <MapPin className="h-3 w-3 shrink-0 text-[#E2B857]" />
              <span className="truncate">{station.diaPhuong}</span>
            </div>
          </div>
        </div>

        {isStamped && (
          <div className="pointer-events-none absolute right-3 top-3">
            <PassportStamp
              stationCode={station.id}
              clusterId={station.cumId}
              dateLabel="ĐÃ ĐÓNG DẤU"
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between bg-[#FBF8F1] p-5">
        <div>
          <div className="text-xs font-semibold" style={{ color: textOnLight }}>
            {station.kienThuc.linhVuc}
          </div>
          <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-[#17262B] transition-colors group-hover:text-[#0B3D3A]">
            <ChemText text={station.ten} />
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4A5B60]">
            <ChemText text={station.moTaNgan} />
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#E3DAC3] pt-3.5 text-xs font-semibold">
          {isStamped && record ? (
            <span className="inline-flex items-center gap-1.5 text-[#2E8B57]">
              <CheckCircle2 className="h-4 w-4" />
              Đã đóng dấu · {record.bestScorePercent}%
            </span>
          ) : (
            <span className="text-[#4A5B60]">Chưa đóng dấu</span>
          )}
          <span className="inline-flex items-center gap-1 text-[#137A6F] group-hover:text-[#0B3D3A]">
            Khám phá
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
