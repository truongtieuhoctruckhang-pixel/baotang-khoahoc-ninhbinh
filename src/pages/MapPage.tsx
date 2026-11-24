import { useState } from 'react';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { CLUSTERS, STATIONS, type CumTram, type TramDiSan } from '../data';
import type { PassportProgress } from '../lib/storage';
import { JourneyMapSvg } from '../components/JourneyMapSvg';

interface MapPageProps {
  progress: PassportProgress;
  onNavigate: (hash: string) => void;
  stations?: TramDiSan[];
  clusters?: CumTram[];
}

export function MapPage({
  progress,
  onNavigate,
  stations = STATIONS,
  clusters = CLUSTERS,
}: MapPageProps) {
  const [filterCluster, setFilterCluster] = useState<'all' | 'cum-1' | 'cum-2' | 'cum-3'>('all');

  const filteredStations =
    filterCluster === 'all'
      ? stations
      : stations.filter((s) => s.cumId === filterCluster);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 pb-16 sm:px-6 sm:py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#137A6F]">
            Bản đồ tương tác 12 trạm
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-[#17262B] sm:text-4xl">
            Bản đồ hành trình di sản
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[#4A5B60]">
            Theo dõi tuyến kết nối liên vùng Hà Nam – Ninh Bình – Nam Định. Chạm trực tiếp vào trạm trên bản đồ hoặc danh sách bên dưới để mở khóa.
          </p>
        </div>

        {/* Interactive Cluster Filter Tabs */}
        <div
          className="inline-flex flex-wrap items-center gap-1 rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-1"
          role="tablist"
          aria-label="Lọc theo cụm di sản"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filterCluster === 'all'}
            onClick={() => setFilterCluster('all')}
            className={`min-h-[38px] rounded-[12px] px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              filterCluster === 'all'
                ? 'bg-[#0B3D3A] text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.10)]'
                : 'text-[#4A5B60] hover:text-[#0B3D3A]'
            }`}
          >
            Tất cả ({stations.length})
          </button>
          {clusters.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={filterCluster === c.id}
              onClick={() => setFilterCluster(c.id)}
              className={`min-h-[38px] rounded-[12px] px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                filterCluster === c.id
                  ? 'bg-[#0B3D3A] text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.10)]'
                  : 'text-[#4A5B60] hover:text-[#0B3D3A]'
              }`}
            >
              {c.soThuTu}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Map */}
      <JourneyMapSvg
        progress={progress}
        stations={stations}
        clusters={clusters}
        activeClusterFilter={filterCluster}
        onSelectStation={(id) => onNavigate(`#/tram/${id}`)}
      />

      {/* Station Directory List */}
      <section className="space-y-3 pt-2">
        <h2 className="font-serif text-xl font-bold text-[#17262B]">
          Danh sách điểm dừng chân ({filteredStations.length} trạm)
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStations.map((station) => {
            const isCompleted = Boolean(progress.completedStations[station.id]?.completed);
            return (
              <button
                key={station.id}
                type="button"
                onClick={() => onNavigate(`#/tram/${station.id}`)}
                className="flex min-h-[68px] items-center gap-3.5 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-3.5 text-left shadow-[0_8px_24px_rgba(11,61,58,0.10)] transition-all hover:border-[#137A6F] active:scale-[0.99]"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] font-serif text-base font-bold tabular-nums ${
                    isCompleted
                      ? 'bg-[#0B3D3A] text-[#FBF8F1]'
                      : 'bg-[#F3EDDD] text-[#17262B] ring-1 ring-[#E3DAC3]'
                  }`}
                >
                  {station.id}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-sm font-bold text-[#17262B]">
                    {station.ten}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#4A5B60]">
                    <MapPin className="h-3 w-3 shrink-0 text-[#137A6F]" />
                    <span className="truncate">{station.diaPhuong}</span>
                  </div>
                </div>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2E8B57]" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#4A5B60]" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
