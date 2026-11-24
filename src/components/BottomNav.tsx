import { BookMarked, Compass, Info, Map as MapIcon, Newspaper } from 'lucide-react';
import type { ActiveRoute } from '../lib/routes';

interface BottomNavProps {
  route: ActiveRoute;
  completedCount: number;
  onNavigate: (hash: string) => void;
}

export function BottomNav({ route, completedCount, onNavigate }: BottomNavProps) {
  const items = [
    {
      id: 'home' as const,
      label: 'Trang chủ',
      hash: '#/',
      icon: Compass,
      isActive: route.view === 'home' || route.view === 'station',
      badge: null as string | null,
    },
    {
      id: 'about' as const,
      label: 'Giới thiệu',
      hash: '#/gioi-thieu',
      icon: Info,
      isActive: route.view === 'about',
      badge: null as string | null,
    },
    {
      id: 'news' as const,
      label: 'Tin tức',
      hash: '#/tin-tuc',
      icon: Newspaper,
      isActive: route.view === 'news',
      badge: null as string | null,
    },
    {
      id: 'passport' as const,
      label: 'Hộ chiếu',
      hash: '#/ho-chieu',
      icon: BookMarked,
      isActive: route.view === 'passport',
      badge: `${completedCount}`,
    },
    {
      id: 'map' as const,
      label: 'Bản đồ',
      hash: '#/ban-do',
      icon: MapIcon,
      isActive: route.view === 'map',
      badge: null as string | null,
    },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E3DAC3] bg-[#FBF8F1]/92 backdrop-blur-md pb-safe md:hidden"
    >
      <div className="mx-auto grid h-14 max-w-lg grid-cols-5 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.hash)}
              className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-[12px] px-1 py-1 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#0B3D3A] ${
                item.isActive
                  ? 'text-[#0B3D3A]'
                  : 'text-[#4A5B60] hover:text-[#0B3D3A]'
              }`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className="h-5 w-5"
                  strokeWidth={item.isActive ? 2.3 : 1.75}
                />
                {item.badge !== null && (
                  <span className="absolute -right-2.5 -top-1 rounded-full bg-[#C9962E] px-1 text-[9px] font-bold leading-tight text-[#0B3D3A] tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] leading-none whitespace-nowrap ${
                  item.isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 h-[2.5px] w-7 rounded-full bg-[#C9962E]"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
