import { Lock } from 'lucide-react';

interface FooterProps {
  teamName: string;
  isAdminSignedIn: boolean;
  onNavigate: (hash: string) => void;
}

export function Footer({ teamName, isAdminSignedIn, onNavigate }: FooterProps) {
  const displayTeam = teamName.trim() || 'Nhóm Nghiên Cứu STEM';

  return (
    <footer className="border-t border-[#E3DAC3]/75 bg-transparent px-4 pt-2 pb-[calc(4.25rem+env(safe-area-inset-bottom))] text-center text-xs text-[#4A5B60] md:py-3">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-0">
        <span className="leading-relaxed">
          © {displayTeam} · Bảo tàng Khoa học số
        </span>
        <a
          href="#/admin"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#/admin');
          }}
          className={`inline-flex min-h-[44px] items-center gap-1 border-0 bg-transparent px-1.5 py-2 text-[11px] leading-none text-[#4A5B60] no-underline transition-opacity duration-150 hover:opacity-100 active:opacity-100 focus-visible:opacity-100 focus-visible:outline-none ${
            isAdminSignedIn ? 'font-medium opacity-80' : 'opacity-45'
          }`}
          aria-label={isAdminSignedIn ? 'Vào trang quản trị' : 'Đăng nhập trang quản trị'}
        >
          <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{isAdminSignedIn ? 'Vào quản trị' : 'Quản trị'}</span>
        </a>
      </div>
    </footer>
  );
}
