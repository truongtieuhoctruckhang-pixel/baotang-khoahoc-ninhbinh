import { ArrowLeft, Compass, MapPinOff } from 'lucide-react';

interface NotFoundPageProps {
  attemptedPath: string;
  onNavigate: (hash: string) => void;
}

export function NotFoundPage({ attemptedPath, onNavigate }: NotFoundPageProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="passport-frame w-full rounded-[16px] bg-[#FBF8F1] p-7 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCEFEA] text-[#0B3D3A]">
          <MapPinOff className="h-8 w-8" />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6414]">
          Mã định danh 404
        </p>
        <h1 className="mt-2 font-serif text-2xl font-bold text-[#17262B] sm:text-3xl">
          Không tìm thấy trạm di sản này
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#4A5B60]">
          Đường dẫn{' '}
          <code className="rounded-[8px] bg-[#F3EDDD] px-1.5 py-0.5 text-xs font-semibold text-[#0B3D3A]">
            {attemptedPath || '#/'}
          </code>{' '}
          không khớp với bất kỳ trạm nào trong 12 trạm của Bảo tàng Khoa học Số (từ Trạm 01 đến Trạm 12).
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => onNavigate('#/')}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2.5 text-sm font-semibold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về Trang chủ</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('#/tram/01')}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#137A6F] transition-colors hover:bg-[#DCEFEA]/50"
          >
            <Compass className="h-4 w-4 text-[#8A6414]" />
            <span>Mở Trạm 01</span>
          </button>
        </div>
      </div>
    </div>
  );
}
