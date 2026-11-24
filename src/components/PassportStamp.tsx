import { useId } from 'react';

interface PassportStampProps {
  stationCode: string;
  clusterId: 'cum-1' | 'cum-2' | 'cum-3';
  dateLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

// Góc nghiêng chân thật trong khoảng -4° đến 4° theo số trạm
const STAMP_TILTS: Record<string, string> = {
  '01': '-rotate-3',
  '02': 'rotate-2',
  '03': '-rotate-4',
  '04': 'rotate-3',
  '05': '-rotate-2',
  '06': 'rotate-4',
  '07': '-rotate-3',
  '08': 'rotate-1',
  '09': '-rotate-4',
  '10': 'rotate-3',
  '11': '-rotate-2',
  '12': 'rotate-2',
};

const INK_COLOR = '#0B3D3A';
const GOLD_RING_COLOR = '#C9962E';

export function PassportStamp({
  stationCode,
  clusterId,
  dateLabel = 'ĐÃ ĐÓNG DẤU',
  size = 'md',
  animate = false,
  className = '',
}: PassportStampProps) {
  const uid = useId().replace(/:/g, '');
  const dimensions =
    size === 'sm' ? 'w-20 h-20' : size === 'lg' ? 'w-32 h-32' : 'w-24 h-24';
  const tiltClass = STAMP_TILTS[stationCode] ?? '-rotate-3';

  // Nhấn tinh tế mã cụm ở hai ngôi sao la bàn
  const clusterStarColor =
    clusterId === 'cum-1' ? '#137A6F' : clusterId === 'cum-2' ? '#B07A1C' : '#1F6F8B';

  return (
    <div
      className={`relative inline-flex select-none items-center justify-center ${dimensions} ${
        animate ? 'animate-stamp-slam' : tiltClass
      } ${className}`}
      aria-label={`Con dấu hoàn thành Trạm ${stationCode}`}
    >
      <svg
        viewBox="0 0 140 140"
        className="h-full w-full drop-shadow-[0_4px_10px_rgba(11,61,58,0.14)]"
      >
        <defs>
          <path id={`topArc-${uid}`} d="M 22,70 A 48,48 0 1,1 118,70" />
          <path id={`bottomArc-${uid}`} d="M 118,70 A 48,48 0 1,1 22,70" />
        </defs>

        {/* Nền giấy kem bán trong suốt */}
        <circle cx="70" cy="70" r="64" fill="#FBF8F1" fillOpacity="0.9" />

        {/* Viền đôi vàng đồng */}
        <circle
          cx="70"
          cy="70"
          r="63"
          fill="none"
          stroke={GOLD_RING_COLOR}
          strokeWidth="2.4"
          strokeDasharray="6 2.5"
          strokeOpacity="0.95"
        />
        <circle
          cx="70"
          cy="70"
          r="57"
          fill="none"
          stroke={GOLD_RING_COLOR}
          strokeWidth="1.4"
          strokeOpacity="0.9"
        />

        {/* Vòng mực xanh ngọc đậm bên trong */}
        <circle
          cx="70"
          cy="70"
          r="39"
          fill="none"
          stroke={INK_COLOR}
          strokeWidth="1.3"
          strokeOpacity="0.85"
        />

        {/* Chữ vòng cung mực xanh ngọc đậm */}
        <text
          fill={INK_COLOR}
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.6"
          fontFamily="Be Vietnam Pro, sans-serif"
        >
          <textPath href={`#topArc-${uid}`} startOffset="50%" textAnchor="middle">
            KHOA HỌC 4.0 · DI SẢN
          </textPath>
        </text>

        <text
          fill={INK_COLOR}
          fontSize="8"
          fontWeight="700"
          letterSpacing="1.4"
          fontFamily="Be Vietnam Pro, sans-serif"
        >
          <textPath href={`#bottomArc-${uid}`} startOffset="50%" textAnchor="middle">
            {dateLabel}
          </textPath>
        </text>

        {/* Số trạm ở tâm */}
        <text
          x="70"
          y="55"
          textAnchor="middle"
          fill={INK_COLOR}
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.5"
          fontFamily="Be Vietnam Pro, sans-serif"
        >
          TRẠM
        </text>
        <text
          x="70"
          y="83"
          textAnchor="middle"
          fill={INK_COLOR}
          fontSize="27"
          fontWeight="700"
          fontFamily="Playfair Display, Georgia, serif"
        >
          {stationCode}
        </text>

        {/* Ngôi sao la bàn hai bên */}
        <polygon points="22,70 25,67 28,70 25,73" fill={clusterStarColor} opacity="0.95" />
        <polygon points="112,70 115,67 118,70 115,73" fill={clusterStarColor} opacity="0.95" />
      </svg>
    </div>
  );
}
