import { Loader2, LogIn, ShieldAlert } from 'lucide-react';

export function AdminAuthCheckingCard() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] px-6 py-4 text-sm font-semibold text-[#17262B] shadow-[0_8px_24px_rgba(11,61,58,0.10)]">
        <Loader2 className="h-5 w-5 animate-spin text-[#137A6F]" />
        <span>Đang kiểm tra phiên đăng nhập...</span>
      </div>
    </div>
  );
}

interface AdminDeniedCardProps {
  deniedEmail: string;
  onRetryOtherAccount: () => void;
  onNavigateHome: () => void;
}

export function AdminDeniedCard({
  deniedEmail,
  onRetryOtherAccount,
  onNavigateHome,
}: AdminDeniedCardProps) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="passport-frame w-full rounded-[16px] bg-[#FBF8F1] p-7 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FBE9E3] text-[#C2553A]">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-serif text-2xl font-bold text-[#17262B]">Không có quyền truy cập</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#4A5B60]">
          Tài khoản <strong className="text-[#17262B]">{deniedEmail}</strong> không có quyền quản trị và đã được tự động đăng xuất để đảm bảo an toàn.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRetryOtherAccount}
            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#0B3D3A] px-4 py-2.5 text-sm font-bold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
          >
            <LogIn className="h-4 w-4 text-[#E2B857]" />
            <span>Đăng nhập bằng tài khoản khác</span>
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD] px-4 py-2 text-xs font-semibold text-[#17262B] hover:border-[#137A6F]"
          >
            Về trang chủ người xem
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminSigningOutCard() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="passport-frame w-full rounded-[16px] bg-[#FBF8F1] p-7 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FBE9E3] text-[#C2553A]">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-serif text-2xl font-bold text-[#17262B]">Không có quyền truy cập</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#4A5B60]">
          Đang tự động đăng xuất tài khoản không có quyền quản trị...
        </p>
      </div>
    </div>
  );
}
