import { useState, type MouseEvent } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { CheckCircle2, Copy, Download, Share2, X } from 'lucide-react';
import type { TramDiSan } from '../data';
import { ChemText } from '../lib/chem';

interface StationShareModalProps {
  station: TramDiSan | null;
  isOpen: boolean;
  onClose: () => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export function StationShareModal({
  station,
  isOpen,
  onClose,
  onNotify,
}: StationShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !station) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#/tram/${station.id}`;

  const handleCopy = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onNotify('success', `Đã sao chép liên kết Trạm ${station.id} vào bộ nhớ tạm!`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onNotify('error', 'Không thể sao chép liên kết. Vui lòng thủ công sao chép trên thanh địa chỉ.');
    }
  };

  const handleDownloadQr = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const canvasEl = document.getElementById(`qr-canvas-${station.id}`) as HTMLCanvasElement;
      if (!canvasEl) {
        onNotify('error', 'Không tìm thấy mã QR để tải xuống.');
        return;
      }

      // Create high-res 1024x1024 canvas with white border padding
      const size = 1024;
      const padding = 80;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = size;
      exportCanvas.height = size;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // Draw original QR canvas centered with padding
      const qrSize = size - padding * 2;
      ctx.drawImage(canvasEl, padding, padding, qrSize, qrSize);

      // Add label text at bottom
      ctx.fillStyle = '#17262B';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Trạm ${station.id}: ${station.ten}`, size / 2, size - 30);

      const dataUrl = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `QR-Tram-${station.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onNotify('success', `Đã tải mã QR Trạm ${station.id} (QR-Tram-${station.id}.png) thành công!`);
    } catch {
      onNotify('error', 'Lỗi khi tạo ảnh mã QR. Vui lòng thử lại.');
    }
  };

  const handleWebShare = async (e: MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trạm ${station.id}: ${station.ten}`,
          text: `Khám phá di sản và khoa học tại Trạm ${station.id} (${station.diaPhuong}) - Hộ Chiếu Du Lịch Khoa Học 4.0`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          onNotify('error', 'Không thể chia sẻ qua trình duyệt.');
        }
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="passport-frame relative w-full max-w-sm rounded-[20px] bg-[#FBF8F1] p-6 text-center shadow-2xl border border-[#E3DAC3]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F3EDDD] text-[#4A5B60] hover:bg-[#E3DAC3] hover:text-[#17262B]"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="inline-flex items-center rounded-full bg-[#DCEFEA] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0B3D3A]">
          Mã QR &amp; Liên kết chia sẻ
        </div>

        <h3 className="mt-2 font-serif text-lg font-bold text-[#17262B]">
          <ChemText text={station.ten} />
        </h3>
        <p className="mt-0.5 text-xs text-[#4A5B60]">Trạm {station.id} · {station.diaPhuong}</p>

        {/* Hidden QR canvas for high-res export */}
        <div className="hidden">
          <QRCodeCanvas
            id={`qr-canvas-${station.id}`}
            value={shareUrl}
            size={1024}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Visible QR display */}
        <div className="mx-auto mt-4 inline-block rounded-[16px] border border-[#E3DAC3] bg-white p-4 shadow-sm">
          <QRCodeCanvas
            value={shareUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#0B3D3A] px-4 py-2.5 text-sm font-bold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" /> : <Copy className="h-4 w-4 text-[#E2B857]" />}
            <span>{copied ? 'Đã sao chép liên kết!' : 'Sao chép liên kết trạm'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQr}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#C9962E] bg-[#F6EBCB] px-4 py-2.5 text-sm font-semibold text-[#8A6414] transition-colors hover:bg-[#E2B857]/40"
          >
            <Download className="h-4 w-4" />
            <span>Tải mã QR (PNG 1024px)</span>
          </button>

          {canShare && (
            <button
              type="button"
              onClick={handleWebShare}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD] px-4 py-2.5 text-sm font-semibold text-[#17262B] transition-colors hover:border-[#137A6F]"
            >
              <Share2 className="h-4 w-4 text-[#137A6F]" />
              <span>Chia sẻ nhanh...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
