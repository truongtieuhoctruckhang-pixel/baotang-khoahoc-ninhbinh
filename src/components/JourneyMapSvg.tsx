import { Check, Compass, MapPin } from 'lucide-react';
import { CLUSTERS, STATIONS, type CumTram, type TramDiSan } from '../data';
import type { PassportProgress } from '../lib/storage';

interface JourneyMapSvgProps {
  progress: PassportProgress;
  onSelectStation: (stationId: string) => void;
  activeClusterFilter?: 'all' | 'cum-1' | 'cum-2' | 'cum-3';
  stations?: TramDiSan[];
  clusters?: CumTram[];
}

// Coordinate layout along a graceful S-curve heritage expedition route (viewBox 0 0 800 500)
const NODE_POSITIONS: Array<{ x: number; y: number; labelSide: 'top' | 'bottom' }> = [
  // Cụm 1: Hà Nam & Ninh Bình Địa chất (01-03)
  { x: 92, y: 105, labelSide: 'bottom' },  // 01
  { x: 245, y: 78, labelSide: 'bottom' },  // 02
  { x: 410, y: 98, labelSide: 'bottom' },  // 03
  // Cụm 2: Ninh Bình Sinh thái (04-06)
  { x: 585, y: 82, labelSide: 'bottom' },  // 04
  { x: 705, y: 175, labelSide: 'bottom' }, // 05
  { x: 615, y: 270, labelSide: 'top' },    // 06
  // Cụm 3: Nam Định Làng nghề & Biển (07-12)
  { x: 440, y: 255, labelSide: 'top' },    // 07
  { x: 265, y: 265, labelSide: 'top' },    // 08
  { x: 105, y: 315, labelSide: 'bottom' }, // 09
  { x: 195, y: 425, labelSide: 'bottom' }, // 10
  { x: 415, y: 432, labelSide: 'bottom' }, // 11
  { x: 665, y: 415, labelSide: 'bottom' }, // 12
];

function buildSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

const CLUSTER_COLORS: Record<TramDiSan['cumId'], string> = {
  'cum-1': '#137A6F',
  'cum-2': '#B07A1C',
  'cum-3': '#1F6F8B',
};

export function JourneyMapSvg({
  progress,
  onSelectStation,
  activeClusterFilter = 'all',
  stations = STATIONS,
  clusters = CLUSTERS,
}: JourneyMapSvgProps) {
  const fullPath = buildSmoothPath(NODE_POSITIONS);
  const nextUnfinished = stations.find(
    (s) => !progress.completedStations[s.id]?.completed
  )?.id;
  const clusterColorMap: Record<TramDiSan['cumId'], string> = {
    'cum-1': clusters.find((c) => c.id === 'cum-1')?.mauDau || CLUSTER_COLORS['cum-1'],
    'cum-2': clusters.find((c) => c.id === 'cum-2')?.mauDau || CLUSTER_COLORS['cum-2'],
    'cum-3': clusters.find((c) => c.id === 'cum-3')?.mauDau || CLUSTER_COLORS['cum-3'],
  };

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-4 shadow-[0_8px_24px_rgba(11,61,58,0.10)] sm:p-6">
      {/* Subtle cartographic compass legend */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DAC3] pb-3 text-xs text-[#4A5B60]">
        <div className="flex items-center gap-2 font-medium text-[#17262B]">
          <Compass className="h-4 w-4 text-[#137A6F]" />
          <span>Tuyến hành trình 12 trạm · Hà Nam – Ninh Bình – Nam Định</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#137A6F]" />
            Đã đóng dấu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-[#C9962E] bg-[#F6EBCB]" />
            Trạm kế tiếp
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-[#CBBF9F] bg-[#FBF8F1]" />
            Chưa mở
          </span>
        </div>
      </div>

      {/* Interactive SVG Map */}
      <div className="w-full overflow-x-auto rounded-[12px] bg-[#FBF8F1] p-2">
        <svg
          viewBox="0 0 800 500"
          className="h-auto w-full min-w-[560px] select-none"
          role="img"
          aria-label="Bản đồ hành trình 12 trạm khoa học"
        >
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#0B3D3A"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={clusterColorMap['cum-1']} />
              <stop offset="50%" stopColor={clusterColorMap['cum-2']} />
              <stop offset="100%" stopColor={clusterColorMap['cum-3']} />
            </linearGradient>
          </defs>

          {/* Background cartography grid */}
          <rect x="0" y="0" width="800" height="500" rx="14" fill="url(#mapGrid)" />

          {/* Regional zone labels */}
          <text x="48" y="42" fill={clusterColorMap['cum-1']} fontSize="11" fontWeight="700" letterSpacing="1.4">
            CỤM 1 · {(clusters[0]?.ten ?? 'HÀ NAM – NINH BÌNH').toUpperCase()}
          </text>
          <text x="515" y="42" fill={clusterColorMap['cum-2']} fontSize="11" fontWeight="700" letterSpacing="1.4">
            CỤM 2 · {(clusters[1]?.ten ?? 'SINH THÁI NINH BÌNH').toUpperCase()}
          </text>
          <text x="48" y="480" fill={clusterColorMap['cum-3']} fontSize="11" fontWeight="700" letterSpacing="1.4">
            CỤM 3 · {(clusters[2]?.ten ?? 'NAM ĐỊNH DI SẢN & BIỂN').toUpperCase()}
          </text>

          {/* Base dashed route */}
          <path
            d={fullPath}
            fill="none"
            stroke="#CBBF9F"
            strokeWidth="4"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />

          {/* Highlighted route segments */}
          {stations.slice(0, -1).map((station, idx) => {
            const nextStation = stations[idx + 1];
            const isSegDone =
              progress.completedStations[station.id]?.completed &&
              progress.completedStations[nextStation.id]?.completed;
            if (!isSegDone) return null;
            const segPath = buildSmoothPath([NODE_POSITIONS[idx], NODE_POSITIONS[idx + 1]]);
            return (
              <path
                key={`seg-${station.id}`}
                d={segPath}
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* 12 Station Nodes */}
          {stations.map((station, idx) => {
            const pos = NODE_POSITIONS[idx];
            if (!pos) return null;
            const isCompleted = Boolean(progress.completedStations[station.id]?.completed);
            const isNext = station.id === nextUnfinished;
            const isDimmed =
              activeClusterFilter !== 'all' && station.cumId !== activeClusterFilter;
            const clusterColor = clusterColorMap[station.cumId];
            const shortName =
              station.ten.split('–')[0].split(':')[0].trim().slice(0, 20);
            const labelY = pos.labelSide === 'bottom' ? pos.y + 34 : pos.y - 26;

            return (
              <g
                key={station.id}
                onClick={() => onSelectStation(station.id)}
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: isDimmed ? 0.28 : 1 }}
                role="button"
                tabIndex={0}
                aria-label={`Mở Trạm ${station.id}: ${station.ten}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStation(station.id);
                  }
                }}
              >
                {/* Next target halo ring */}
                {isNext && !isCompleted && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="24"
                    fill="#F6EBCB"
                    fillOpacity="0.7"
                    stroke="#C9962E"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={isCompleted ? clusterColor : isNext ? '#F6EBCB' : '#FBF8F1'}
                  stroke={isCompleted ? clusterColor : isNext ? '#C9962E' : '#CBBF9F'}
                  strokeWidth={isNext && !isCompleted ? '2.5' : '2'}
                />

                {/* Number inside node */}
                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fill={isCompleted ? '#FBF8F1' : '#17262B'}
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="Be Vietnam Pro, sans-serif"
                >
                  {station.id}
                </text>

                {/* Completed mini badge */}
                {isCompleted && (
                  <g transform={`translate(${pos.x + 11}, ${pos.y - 17})`}>
                    <circle cx="0" cy="0" r="7.5" fill="#C9962E" stroke="#FBF8F1" strokeWidth="1.5" />
                    <path
                      d="M -3 0 L -1 2.2 L 3.2 -2.2"
                      fill="none"
                      stroke="#0B3D3A"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {/* Label */}
                <text
                  x={pos.x}
                  y={labelY}
                  textAnchor="middle"
                  fill={isCompleted || isNext ? '#17262B' : '#4A5B60'}
                  fontSize="11"
                  fontWeight={isCompleted || isNext ? '700' : '500'}
                  fontFamily="Be Vietnam Pro, sans-serif"
                >
                  {shortName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick legend footer */}
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#4A5B60]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#137A6F]" />
          Chạm vào số trạm trên bản đồ để mở trực tiếp nội dung khám phá.
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#137A6F]">
          <Check className="h-3.5 w-3.5" />
          Tuyến đường đồng bộ tự động với Hộ chiếu
        </span>
      </div>
    </div>
  );
}
