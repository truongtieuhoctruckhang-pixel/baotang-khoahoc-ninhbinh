import { BookOpen, FlaskConical, Plus, Trash2, Video } from 'lucide-react';
import type { TramDiSan } from '../data';
import { extractYoutubeId } from '../lib/youtube';
import { ChemTextField } from './ChemTextField';
import { INPUT_CLASS, LABEL_CLASS } from './adminUtils';

interface StationKnowledgeVideoFieldsProps {
  draftStation: TramDiSan;
  youtubeInput: string;
  onUpdateStation: (updater: (prev: TramDiSan) => TramDiSan) => void;
  onYoutubeInputChange: (val: string) => void;
}

export function StationKnowledgeVideoFields({
  draftStation,
  youtubeInput,
  onUpdateStation,
  onYoutubeInputChange,
}: StationKnowledgeVideoFieldsProps) {
  const parsedYoutube = extractYoutubeId(youtubeInput);

  return (
    <>
      <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-[#E3DAC3] pb-3">
          <BookOpen className="h-5 w-5 text-[#137A6F]" />
          <h2 className="font-serif text-xl font-bold text-[#17262B]">
            Kiến thức khoa học &amp; Phương trình hóa học
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Nội dung kiến thức khoa học trọng tâm</label>
            <ChemTextField
              multiline
              rows={4}
              value={draftStation.kienThuc.tomTat}
              maxLength={3000}
              onChange={(nextVal) =>
                onUpdateStation((prev) => ({
                  ...prev,
                  kienThuc: { ...prev.kienThuc, tomTat: nextVal },
                }))
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5B60]">
                Các điểm nhấn kiến thức ({draftStation.kienThuc.diemNhan.length})
              </label>
              {draftStation.kienThuc.diemNhan.length < 12 && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateStation((prev) => ({
                      ...prev,
                      kienThuc: {
                        ...prev.kienThuc,
                        diemNhan: [...prev.kienThuc.diemNhan, ''],
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-[8px] bg-[#DCEFEA] px-2.5 py-1 text-xs font-semibold text-[#0B3D3A] hover:bg-[#137A6F] hover:text-[#FBF8F1]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm ý</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {draftStation.kienThuc.diemNhan.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3EDDD] text-xs font-bold text-[#17262B]">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <ChemTextField
                      value={point}
                      compactToolbar
                      onChange={(nextVal) => {
                        const nextPoints = [...draftStation.kienThuc.diemNhan];
                        nextPoints[idx] = nextVal;
                        onUpdateStation((prev) => ({
                          ...prev,
                          kienThuc: { ...prev.kienThuc, diemNhan: nextPoints },
                        }));
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextPoints = draftStation.kienThuc.diemNhan.filter((_, pIdx) => pIdx !== idx);
                      onUpdateStation((prev) => ({
                        ...prev,
                        kienThuc: { ...prev.kienThuc, diemNhan: nextPoints },
                      }));
                    }}
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E3DAC3] text-[#C2553A] hover:bg-[#FBE9E3]"
                    aria-label="Xóa ý"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-[14px] border border-[#C9962E]/50 bg-[#F6EBCB]/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A6414]">
              <FlaskConical className="h-4 w-4" />
              <span>Phương trình hóa học / Quy luật khoa học</span>
            </div>
            <div>
              <label className={LABEL_CLASS}>Phương trình / Công thức</label>
              <ChemTextField
                value={draftStation.kienThuc.phuongTrinh}
                maxLength={400}
                alwaysShowPreview
                placeholder="Ví dụ: {{CaCO3 + 2HCl -> CaCl2 + H2O + CO2^}}"
                onChange={(nextVal) =>
                  onUpdateStation((prev) => ({
                    ...prev,
                    kienThuc: { ...prev.kienThuc, phuongTrinh: nextVal },
                  }))
                }
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Giải thích phương trình</label>
              <ChemTextField
                multiline
                rows={2}
                value={draftStation.kienThuc.giaiThichPhuongTrinh}
                maxLength={800}
                onChange={(nextVal) =>
                  onUpdateStation((prev) => ({
                    ...prev,
                    kienThuc: { ...prev.kienThuc, giaiThichPhuongTrinh: nextVal },
                  }))
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-[#E3DAC3] pb-3">
          <Video className="h-5 w-5 text-[#137A6F]" />
          <h2 className="font-serif text-xl font-bold text-[#17262B]">Video YouTube tư liệu</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={LABEL_CLASS}>Link video YouTube (dán link bất kỳ hoặc ID 11 ký tự)</label>
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => onYoutubeInputChange(e.target.value)}
              placeholder="Ví dụ: https://youtu.be/... hoặc https://www.youtube.com/watch?v=..."
              className={INPUT_CLASS}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#4A5B60]">ID nhận diện được:</span>
              <code
                className={`rounded-[8px] px-2 py-0.5 font-bold ${
                  parsedYoutube.isValid ? 'bg-[#E4F4EA] text-[#2E8B57]' : 'bg-[#FBE9E3] text-[#C2553A]'
                }`}
              >
                {draftStation.video.youtubeId || 'Chưa nhận diện'}
              </code>
            </div>

            <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-[12px] border border-[#E3DAC3] bg-[#F3EDDD]/70 p-3">
              <input
                type="checkbox"
                checked={Boolean(draftStation.autoplay)}
                onChange={(e) =>
                  onUpdateStation((prev) => ({ ...prev, autoplay: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#0B3D3A]"
              />
              <span className="block">
                <span className="block text-sm font-semibold text-[#17262B]">
                  Tự động phát video khi mở trạm
                </span>
                <span className="mt-0.5 block text-xs text-[#4A5B60]">
                  Video sẽ tự chạy ở chế độ tắt tiếng; người xem chạm để bật tiếng
                </span>
              </span>
            </label>
          </div>

          <div>
            <label className={LABEL_CLASS}>Tiêu đề video</label>
            <ChemTextField
              value={draftStation.video.tieuDe}
              maxLength={200}
              compactToolbar
              onChange={(nextVal) =>
                onUpdateStation((prev) => ({
                  ...prev,
                  video: { ...prev.video, tieuDe: nextVal },
                }))
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Thời lượng</label>
            <input
              type="text"
              value={draftStation.video.thoiLuong}
              maxLength={32}
              placeholder="04:20"
              onChange={(e) =>
                onUpdateStation((prev) => ({
                  ...prev,
                  video: { ...prev.video, thoiLuong: e.target.value },
                }))
              }
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
