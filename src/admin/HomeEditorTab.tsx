import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import type { CumTram, ProjectInfo } from '../data';
import { CoverImageField } from './CoverImageField';
import { HomeClustersEditor } from './HomeClustersEditor';
import { INPUT_CLASS, LABEL_CLASS } from './adminUtils';

interface HomeEditorTabProps {
  draftProject: ProjectInfo;
  draftClusters: CumTram[];
  homeDirty: boolean;
  hasLocalHomeDraft: boolean;
  saving: boolean;
  onChangeProject: (updater: (prev: ProjectInfo) => ProjectInfo) => void;
  onChangeClusters: (nextClusters: CumTram[]) => void;
  onDiscardDraft: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export function HomeEditorTab({
  draftProject,
  draftClusters,
  homeDirty,
  hasLocalHomeDraft,
  saving,
  onChangeProject,
  onChangeClusters,
  onDiscardDraft,
  onSaveDraft,
  onPublish,
  onPreview,
  onNotify,
}: HomeEditorTabProps) {
  return (
    <div className="space-y-6">
      {hasLocalHomeDraft && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#C9962E] bg-[#F6EBCB] px-4 py-3 text-xs text-[#17262B]">
          <span>
            Bạn đang xem <strong>bản nháp cục bộ</strong> của Trang chủ &amp; 3 Cụm (chưa đăng lên Firebase).
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

      {/* Hero Info */}
      <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-[#E3DAC3] pb-3">
          <h2 className="font-serif text-xl font-bold text-[#17262B]">Nội dung Trang chủ (Hero)</h2>
          {(homeDirty || hasLocalHomeDraft) && (
            <span className="rounded-full bg-[#F6EBCB] px-2.5 py-0.5 text-xs font-semibold text-[#8A6414]">
              {hasLocalHomeDraft ? 'Đang dùng bản nháp' : 'Có thay đổi chưa lưu'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS}>Tiêu đề dự án</label>
            <input
              type="text"
              value={draftProject.tenDuAn}
              maxLength={180}
              onChange={(e) => onChangeProject((prev) => ({ ...prev, tenDuAn: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Tiêu đề phụ</label>
            <input
              type="text"
              value={draftProject.tenPhu}
              maxLength={200}
              onChange={(e) => onChangeProject((prev) => ({ ...prev, tenPhu: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL_CLASS}>Khẩu hiệu (Slogan)</label>
            <textarea
              rows={2}
              value={draftProject.khauHieu}
              maxLength={500}
              onChange={(e) => onChangeProject((prev) => ({ ...prev, khauHieu: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>

          <CoverImageField
            label="Ảnh bìa trang chủ (<300KB)"
            value={draftProject.anhBia}
            alt={draftProject.tenDuAn}
            uploadButtonLabel="Tải ảnh bìa từ máy"
            previewWidthClass="h-28 w-full sm:w-44"
            onChange={(nextAnhBia) => onChangeProject((prev) => ({ ...prev, anhBia: nextAnhBia }))}
            onNotify={onNotify}
            successToastText="Đã nén ảnh bìa trang chủ dưới 300KB."
          />
        </div>
      </div>

      {/* Team Introduction */}
      <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
        <h2 className="mb-4 border-b border-[#E3DAC3] pb-3 font-serif text-xl font-bold text-[#17262B]">
          Giới thiệu nhóm thực hiện
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS}>Tên nhóm thực hiện</label>
            <input
              type="text"
              value={draftProject.nhomThucHien.tenNhom}
              maxLength={200}
              onChange={(e) =>
                onChangeProject((prev) => ({
                  ...prev,
                  nhomThucHien: { ...prev.nhomThucHien, tenNhom: e.target.value },
                }))
              }
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Đơn vị / Cuộc thi</label>
            <input
              type="text"
              value={draftProject.nhomThucHien.donVi}
              maxLength={200}
              onChange={(e) =>
                onChangeProject((prev) => ({
                  ...prev,
                  nhomThucHien: { ...prev.nhomThucHien, donVi: e.target.value },
                }))
              }
              className={INPUT_CLASS}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL_CLASS}>Đoạn giới thiệu nhóm</label>
            <textarea
              rows={3}
              value={draftProject.nhomThucHien.gioiThieu}
              maxLength={1500}
              onChange={(e) =>
                onChangeProject((prev) => ({
                  ...prev,
                  nhomThucHien: { ...prev.nhomThucHien, gioiThieu: e.target.value },
                }))
              }
              className={INPUT_CLASS}
            />
          </div>

          <div className="space-y-2.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5B60]">
                Thành viên nhóm ({draftProject.nhomThucHien.thanhVien.length})
              </label>
              {draftProject.nhomThucHien.thanhVien.length < 15 && (
                <button
                  type="button"
                  onClick={() =>
                    onChangeProject((prev) => ({
                      ...prev,
                      nhomThucHien: {
                        ...prev.nhomThucHien,
                        thanhVien: [...prev.nhomThucHien.thanhVien, { hoTen: '', vaiTro: '' }],
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-[8px] bg-[#DCEFEA] px-2.5 py-1 text-xs font-semibold text-[#0B3D3A]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm thành viên</span>
                </button>
              )}
            </div>

            {draftProject.nhomThucHien.thanhVien.map((member, mIdx) => (
              <div
                key={mIdx}
                className="grid grid-cols-1 gap-2 rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD] p-3 sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={member.hoTen}
                    onChange={(e) => {
                      const nextMembers = [...draftProject.nhomThucHien.thanhVien];
                      nextMembers[mIdx] = { ...member, hoTen: e.target.value };
                      onChangeProject((prev) => ({
                        ...prev,
                        nhomThucHien: { ...prev.nhomThucHien, thanhVien: nextMembers },
                      }));
                    }}
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    placeholder="Vai trò chuyên môn"
                    value={member.vaiTro}
                    onChange={(e) => {
                      const nextMembers = [...draftProject.nhomThucHien.thanhVien];
                      nextMembers[mIdx] = { ...member, vaiTro: e.target.value };
                      onChangeProject((prev) => ({
                        ...prev,
                        nhomThucHien: { ...prev.nhomThucHien, thanhVien: nextMembers },
                      }));
                    }}
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="flex justify-end sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextMembers = draftProject.nhomThucHien.thanhVien.filter((_, idx) => idx !== mIdx);
                      onChangeProject((prev) => ({
                        ...prev,
                        nhomThucHien: { ...prev.nhomThucHien, thanhVien: nextMembers },
                      }));
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E3DAC3] bg-[#FBF8F1] text-[#C2553A] hover:bg-[#FBE9E3]"
                    aria-label="Xóa thành viên"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Clusters Editor */}
      <HomeClustersEditor
        draftClusters={draftClusters}
        saving={saving}
        onChangeClusters={onChangeClusters}
        onPreview={onPreview}
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
      />
    </div>
  );
}
