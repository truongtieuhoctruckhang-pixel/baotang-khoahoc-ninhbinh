import { FileEdit, RotateCcw } from 'lucide-react';
import type { CumTram, TramDiSan } from '../data';
import { ChemTextField } from './ChemTextField';
import { CoverImageField } from './CoverImageField';
import { StationKnowledgeVideoFields } from './StationKnowledgeVideoFields';
import { StationQuizEditor } from './StationQuizEditor';
import { INPUT_CLASS, LABEL_CLASS, readLocalStationDraft } from './adminUtils';

interface StationEditorTabProps {
  stations: TramDiSan[];
  clusters: CumTram[];
  selectedStationId: string;
  draftStation: TramDiSan;
  youtubeInput: string;
  stationDirty: boolean;
  hasLocalStationDraft: boolean;
  saving: boolean;
  onSelectStation: (stationId: string) => void;
  onUpdateStation: (updater: (prev: TramDiSan) => TramDiSan) => void;
  onYoutubeInputChange: (val: string) => void;
  onDiscardDraft: () => void;
  onPreview: () => void;
  onSave: () => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export function StationEditorTab({
  stations,
  clusters,
  selectedStationId,
  draftStation,
  youtubeInput,
  stationDirty,
  hasLocalStationDraft,
  saving,
  onSelectStation,
  onUpdateStation,
  onYoutubeInputChange,
  onDiscardDraft,
  onPreview,
  onSave,
  onNotify,
}: StationEditorTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-4 xl:col-span-3">
        <div className="rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-3.5 shadow-[0_8px_24px_rgba(11,61,58,0.08)]">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17262B]">
              Danh sách 12 trạm
            </span>
            {(stationDirty || hasLocalStationDraft) && (
              <span className="rounded-full bg-[#F6EBCB] px-2 py-0.5 text-[11px] font-semibold text-[#8A6414]">
                {hasLocalStationDraft ? 'Có nháp' : 'Chưa lưu'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {stations.map((st) => {
              const isSelected = st.id === selectedStationId;
              const hasDraft = Boolean(readLocalStationDraft(st.id));
              const cColor = clusters.find((c) => c.id === st.cumId)?.mauDau ?? '#137A6F';
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectStation(st.id)}
                  className={`flex min-h-[48px] items-center gap-2.5 rounded-[12px] border px-3 py-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#0B3D3A] bg-[#0B3D3A] text-[#FBF8F1] shadow-sm'
                      : 'border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F]'
                  }`}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-xs font-bold tabular-nums text-[#FBF8F1]"
                    style={{ backgroundColor: isSelected ? '#C9962E' : cColor }}
                  >
                    {st.id}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{st.ten}</span>
                  {hasDraft && <FileEdit className="h-3.5 w-3.5 shrink-0 text-[#C9962E]" />}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="space-y-6 lg:col-span-8 xl:col-span-9">
        {hasLocalStationDraft && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#C9962E] bg-[#F6EBCB] px-4 py-3 text-xs text-[#17262B]">
            <span>
              Bạn đang xem <strong>bản nháp cục bộ</strong> của Trạm {draftStation.id} (chưa xuất bản lên Firebase).
            </span>
            <button
              type="button"
              onClick={onDiscardDraft}
              className="inline-flex items-center gap-1 font-bold text-[#8A6414] underline hover:text-[#17262B]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Khôi phục bản đang đăng</span>
            </button>
          </div>
        )}

        {/* Block 1: Basic Info & Cover Image */}
        <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-[#E3DAC3] pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A6414]">
                Đang chỉnh sửa Trạm {draftStation.id}
              </span>
              <h2 className="font-serif text-xl font-bold text-[#17262B]">Thông tin chung &amp; Ảnh bìa</h2>
            </div>
            <span className="rounded-full bg-[#DCEFEA] px-3 py-1 text-xs font-semibold text-[#0B3D3A]">
              #/tram/{draftStation.id}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Tên trạm</label>
              <ChemTextField
                value={draftStation.ten}
                maxLength={180}
                onChange={(nextVal) => onUpdateStation((prev) => ({ ...prev, ten: nextVal }))}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Thuộc cụm</label>
              <select
                value={draftStation.cumId}
                onChange={(e) => {
                  const nextCumId = e.target.value as TramDiSan['cumId'];
                  const matched = clusters.find((c) => c.id === nextCumId);
                  onUpdateStation((prev) => ({
                    ...prev,
                    cumId: nextCumId,
                    cum: matched ? `${matched.ten} (${matched.chuDe})` : prev.cum,
                  }));
                }}
                className={INPUT_CLASS}
              >
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>{c.soThuTu}: {c.ten}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL_CLASS}>Nhãn hiển thị cụm trên trạm</label>
              <input
                type="text"
                value={draftStation.cum}
                maxLength={160}
                onChange={(e) => onUpdateStation((prev) => ({ ...prev, cum: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Địa phương</label>
              <input
                type="text"
                value={draftStation.diaPhuong}
                maxLength={160}
                onChange={(e) => onUpdateStation((prev) => ({ ...prev, diaPhuong: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Lĩnh vực khoa học</label>
              <input
                type="text"
                value={draftStation.kienThuc.linhVuc}
                maxLength={160}
                onChange={(e) =>
                  onUpdateStation((prev) => ({
                    ...prev,
                    kienThuc: { ...prev.kienThuc, linhVuc: e.target.value },
                  }))
                }
                className={INPUT_CLASS}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Mô tả ngắn (hiện trên thẻ trang chủ)</label>
              <ChemTextField
                multiline
                rows={2}
                value={draftStation.moTaNgan}
                maxLength={600}
                onChange={(nextVal) => onUpdateStation((prev) => ({ ...prev, moTaNgan: nextVal }))}
                className={INPUT_CLASS}
              />
            </div>

            <CoverImageField
              label="Ảnh bìa trạm (dán link hoặc tải ảnh lên <300KB)"
              value={draftStation.anh}
              alt={draftStation.ten}
              uploadButtonLabel="Tải ảnh lên từ máy"
              helperText="Tự động nén dưới 300KB và lưu trực tiếp trong Firestore."
              previewWidthClass="h-28 w-full sm:w-44"
              onChange={(nextAnh) => onUpdateStation((prev) => ({ ...prev, anh: nextAnh }))}
              onNotify={onNotify}
            />
          </div>
        </div>

        {/* Block 2 & 3: Scientific Knowledge & YouTube Video */}
        <StationKnowledgeVideoFields
          draftStation={draftStation}
          youtubeInput={youtubeInput}
          onUpdateStation={onUpdateStation}
          onYoutubeInputChange={onYoutubeInputChange}
        />

        <StationQuizEditor
          station={draftStation}
          saving={saving}
          onUpdateStation={onUpdateStation}
          onPreview={onPreview}
          onSave={onSave}
          onNotify={onNotify}
        />
      </section>
    </div>
  );
}
