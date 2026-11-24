import { useRef, type ChangeEvent } from 'react';
import { Database, Download, Home, Loader2, LogOut, Upload } from 'lucide-react';

interface AdminHeaderProps {
  userEmail: string;
  isSyncedToFirebase: boolean;
  seeding: boolean;
  onRequestSeed: () => void;
  onExportJson: () => void;
  onImportJson: (e: ChangeEvent<HTMLInputElement>) => void;
  onNavigateHome: () => void;
  onSignOut: () => void;
}

export function AdminHeader({
  userEmail,
  isSyncedToFirebase,
  seeding,
  onRequestSeed,
  onExportJson,
  onImportJson,
  onNavigateHome,
  onSignOut,
}: AdminHeaderProps) {
  const importFileRef = useRef<HTMLInputElement | null>(null);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E3DAC3] bg-[#0B3D3A] text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.14)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#137A6F] text-[#E2B857]">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold leading-tight text-[#FBF8F1] sm:text-lg">
              Quản Trị Nội Dung (CMS) · Hộ Chiếu Khoa Học 4.0
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-[#DCEFEA]">
              <span>{userEmail}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                  isSyncedToFirebase
                    ? 'bg-[#2E8B57]/25 text-[#E4F4EA]'
                    : 'bg-[#C9962E]/25 text-[#F6EBCB]'
                }`}
              >
                {isSyncedToFirebase
                  ? 'Đã đồng bộ đầy đủ với Firebase'
                  : 'Một số mục đang dùng dữ liệu mặc định'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRequestSeed}
            disabled={seeding}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[12px] bg-[#C9962E] px-3 py-2 text-xs font-bold text-[#0B3D3A] transition-colors hover:bg-[#E2B857] disabled:opacity-60"
          >
            {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
            <span>Nạp dữ liệu mẫu lên Firebase</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[12px] border border-[#E2B857]/50 bg-[#0B3D3A] px-3 py-2 text-xs font-semibold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
          >
            <Download className="h-3.5 w-3.5 text-[#E2B857]" />
            <span>Xuất dữ liệu (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => importFileRef.current?.click()}
            disabled={seeding}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[12px] border border-[#E2B857]/50 bg-[#0B3D3A] px-3 py-2 text-xs font-semibold text-[#FBF8F1] transition-colors hover:bg-[#137A6F] disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5 text-[#E2B857]" />
            <span>Nhập dữ liệu</span>
          </button>
          <input
            ref={importFileRef}
            type="file"
            accept="application/json,.json"
            onChange={onImportJson}
            className="hidden"
          />

          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[12px] border border-[#FBF8F1]/25 px-3 py-2 text-xs font-semibold text-[#FBF8F1] hover:bg-[#FBF8F1]/10"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Xem trang web</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[12px] border border-[#FBF8F1]/25 px-3 py-2 text-xs font-semibold text-[#FBF8F1] hover:bg-[#C2553A]"
            title="Đăng xuất"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}
