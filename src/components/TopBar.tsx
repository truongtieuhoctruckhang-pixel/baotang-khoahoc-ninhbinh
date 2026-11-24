import { BookMarked, Compass } from 'lucide-react';
import type { ActiveRoute } from '../lib/routes';

interface TopBarProps {
  route: ActiveRoute;
  completedCount: number;
  onNavigate: (hash: string) => void;
}

export function TopBar({ route, completedCount, onNavigate }: TopBarProps) {
  const navItems = [
    { label: 'Trang chủ', hash: '#/', active: route.view === 'home' },
    { label: 'Giới thiệu', hash: '#/gioi-thieu', active: route.view === 'about' },
    { label: 'Tin tức', hash: '#/tin-tuc', active: route.view === 'news' },
    { label: 'Hộ chiếu', hash: '#/ho-chieu', active: route.view === 'passport' },
    { label: 'Bản đồ', hash: '#/ban-do', active: route.view === 'map' },
  ];

  return (
    <header className="relative z-30 border-b border-[#E3DAC3] bg-[#FBF8F1]/92 backdrop-blur-md md:sticky md:top-0">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:gap-8">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#/');
          }}
          className="inline-flex min-h-[44px] items-center gap-2 font-serif text-base font-bold tracking-tight text-[#17262B] whitespace-nowrap shrink-0 sm:text-lg"
        >
          <Compass className="h-5 w-5 text-[#137A6F] shrink-0" />
          <span>Hộ Chiếu Khoa Học 4.0</span>
        </a>

        {/* Zone 2: Clean single-line navigation links (Desktop) */}
        <nav
          className="hidden items-center gap-5 text-sm font-medium text-[#4A5B60] md:flex lg:gap-7"
          aria-label="Điều hướng chính"
        >
          {navItems.map((item) => (
            <a
              key={item.hash}
              href={item.hash}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.hash);
              }}
              className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#0B3D3A] ${
                item.active ? 'font-semibold text-[#0B3D3A]' : ''
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-[#C9962E]" />
              )}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <button
          type="button"
          onClick={() => onNavigate('#/ho-chieu')}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-3.5 py-2 text-xs font-semibold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.10)] transition-all duration-150 hover:bg-[#137A6F] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D3A]"
        >
          <BookMarked className="h-3.5 w-3.5 text-[#E2B857]" />
          <span className="tabular-nums">{completedCount}/12 trạm</span>
        </button>
      </div>
    </header>
  );
}
