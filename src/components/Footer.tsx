import { Lock, LogOut } from 'lucide-react';

interface FooterProps {
  teamName: string;
  isAdminSignedIn: boolean;
  onNavigate: (hash: string) => void;
  onSignOut?: () => void;
}

export function Footer({ teamName, isAdminSignedIn, onNavigate, onSignOut }: FooterProps) {
  const displayTeam = teamName.trim() || 'Nhóm Nghiên Cứu STEM';

  return (
    <footer className="border-t border-[#E3DAC3]/75 bg-transparent pt-3 pb-[calc(4.25rem+env(safe-area-inset-bottom))] text-xs text-[#4A5B60] md:py-3.5">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 sm:px-6 md:justify-between">
        <span className="text-center md:text-left leading-relaxed">
          © {displayTeam} · Bảo tàng Khoa học số
        </span>
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#/admin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#/admin');
            }}
            className="inline-flex items-center gap-1 text-xs text-[#4A5B60] no-underline hover:underline transition-all"
            aria-label={isAdminSignedIn ? 'Vào trang quản trị' : 'Trang quản trị'}
          >
            <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{isAdminSignedIn ? 'Vào quản trị' : 'Quản trị'}</span>
          </a>
          {isAdminSignedIn && onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1 text-xs text-[#4A5B60] hover:text-[#C2553A] hover:underline bg-transparent border-0 cursor-pointer p-0"
              title="Đăng xuất tài khoản quản trị"
            >
              <LogOut className="h-3 w-3 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
