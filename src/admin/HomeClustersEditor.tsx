import { Eye, Loader2, Save, Send } from 'lucide-react';
import type { CumTram } from '../data';
import { INPUT_CLASS, LABEL_CLASS } from './adminUtils';

interface HomeClustersEditorProps {
  draftClusters: CumTram[];
  saving: boolean;
  onChangeClusters: (nextClusters: CumTram[]) => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function HomeClustersEditor({
  draftClusters,
  saving,
  onChangeClusters,
  onPreview,
  onSaveDraft,
  onPublish,
}: HomeClustersEditorProps) {
  return (
    <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
      <h2 className="mb-4 border-b border-[#E3DAC3] pb-3 font-serif text-xl font-bold text-[#17262B]">
        Tên &amp; Màu sắc 3 Cụm di sản
      </h2>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {draftClusters.map((cluster, cIdx) => (
          <div
            key={cluster.id}
            className="space-y-3 rounded-[14px] border border-[#E3DAC3] bg-[#F3EDDD] p-4"
            style={{ borderTop: `4px solid ${cluster.mauDau}` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17262B]">{cluster.soThuTu}</span>
              <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ backgroundColor: cluster.mauDau }} />
            </div>

            <div>
              <label className={LABEL_CLASS}>Tên cụm</label>
              <input
                type="text"
                value={cluster.ten}
                maxLength={120}
                onChange={(e) => {
                  const next = [...draftClusters];
                  next[cIdx] = { ...cluster, ten: e.target.value };
                  onChangeClusters(next);
                }}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Chủ đề cụm</label>
              <input
                type="text"
                value={cluster.chuDe}
                maxLength={160}
                onChange={(e) => {
                  const next = [...draftClusters];
                  next[cIdx] = { ...cluster, chuDe: e.target.value };
                  onChangeClusters(next);
                }}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Mô tả ngắn</label>
              <textarea
                rows={3}
                value={cluster.moTa}
                maxLength={600}
                onChange={(e) => {
                  const next = [...draftClusters];
                  next[cIdx] = { ...cluster, moTa: e.target.value };
                  onChangeClusters(next);
                }}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Màu nhận diện cụm</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(cluster.mauDau) ? cluster.mauDau : '#137A6F'}
                  onChange={(e) => {
                    const next = [...draftClusters];
                    next[cIdx] = { ...cluster, mauDau: e.target.value.toUpperCase() };
                    onChangeClusters(next);
                  }}
                  className="h-10 w-14 cursor-pointer rounded-[10px] border border-[#E3DAC3] bg-[#FBF8F1] p-1"
                />
                <input
                  type="text"
                  value={cluster.mauDau}
                  maxLength={20}
                  onChange={(e) => {
                    const next = [...draftClusters];
                    next[cIdx] = { ...cluster, mauDau: e.target.value };
                    onChangeClusters(next);
                  }}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2.5 border-t border-[#E3DAC3] pt-4">
        <button type="button" onClick={onPreview} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] px-4 py-2 text-sm font-semibold text-[#137A6F] hover:bg-[#DCEFEA]">
          <Eye className="h-4 w-4" />
          <span>Xem trước</span>
        </button>
        <button type="button" onClick={onSaveDraft} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-[#C9962E] bg-[#F6EBCB] px-4 py-2 text-sm font-semibold text-[#8A6414] hover:bg-[#E2B857]/40">
          <Save className="h-4 w-4" />
          <span>Lưu nháp</span>
        </button>
        <button type="button" onClick={onPublish} disabled={saving} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-6 py-2 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F] disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-[#E2B857]" />}
          <span>Đăng cấu hình Trang chủ &amp; 3 Cụm</span>
        </button>
      </div>
    </div>
  );
}
