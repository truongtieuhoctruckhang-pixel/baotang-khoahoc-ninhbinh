import { useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Eye, Loader2, Plus, Save, Trash2, AlertCircle } from 'lucide-react';
import type { CauHoi, QuestionType, TramDiSan } from '../data';
import { ChemTextField } from './ChemTextField';
import { CoverImageField } from './CoverImageField';
import { INPUT_CLASS, LABEL_CLASS } from './adminUtils';

interface StationQuizEditorProps {
  station: TramDiSan;
  saving: boolean;
  onUpdateStation: (updater: (prev: TramDiSan) => TramDiSan) => void;
  onPreview: () => void;
  onSave: () => void;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

const QUESTION_TYPES: { id: QuestionType; label: string }[] = [
  { id: 'single', label: '1. Một đáp án đúng (Single)' },
  { id: 'multi', label: '2. Nhiều đáp án đúng (Multi)' },
  { id: 'truefalse', label: '3. Đúng / Sai (True/False)' },
  { id: 'short', label: '4. Điền đáp án ngắn (Short)' },
  { id: 'match', label: '5. Ghép đôi (Match)' },
  { id: 'order', label: '6. Sắp xếp thứ tự (Order)' },
  { id: 'balance', label: '7. Cân bằng phương trình (Balance)' },
];

export function StationQuizEditor({
  station,
  saving,
  onUpdateStation,
  onPreview,
  onSave,
  onNotify,
}: StationQuizEditorProps) {
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddQuestion = () => {
    if (station.cauHoi.length >= 20) return;
    const newQ: CauHoi = {
      type: 'single',
      cauHoi: '',
      dapAn: ['', '', '', ''],
      dapAnDung: 0,
      giaiThich: '',
    };
    onUpdateStation((prev) => ({ ...prev, cauHoi: [...prev.cauHoi, newQ] }));
    setErrorIndex(null);
    setErrorMessage(null);
  };

  const handleDuplicate = (idx: number) => {
    if (station.cauHoi.length >= 20) return;
    const q = station.cauHoi[idx];
    const duplicated: CauHoi = structuredClone(q);
    const nextQuiz = [...station.cauHoi];
    nextQuiz.splice(idx + 1, 0, duplicated);
    onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= station.cauHoi.length) return;
    const nextQuiz = [...station.cauHoi];
    const temp = nextQuiz[idx];
    nextQuiz[idx] = nextQuiz[targetIdx];
    nextQuiz[targetIdx] = temp;
    onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
  };

  const validateAndSave = () => {
    for (let i = 0; i < station.cauHoi.length; i++) {
      const q = station.cauHoi[i];
      if (!q.cauHoi.trim()) {
        setErrorIndex(i);
        setErrorMessage(`Câu hỏi ${i + 1} chưa có nội dung.`);
        onNotify('error', `Câu hỏi ${i + 1} chưa có nội dung.`);
        return;
      }
      const qType = q.type ?? 'single';
      if (qType === 'single') {
        const opts = q.dapAn ?? [];
        if (opts.length < 2 || opts.some((o) => !o.trim())) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Một đáp án đúng) thiếu đáp án.`);
          onNotify('error', `Câu hỏi ${i + 1} thiếu đáp án.`);
          return;
        }
      } else if (qType === 'multi') {
        const opts = q.dapAn ?? [];
        const correctM = q.dapAnDungMulti ?? [];
        if (opts.length < 2 || correctM.length === 0) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Nhiều đáp án đúng) cần ít nhất 2 lựa chọn và 1 đáp án đúng.`);
          onNotify('error', `Câu hỏi ${i + 1} chưa chọn đáp án đúng.`);
          return;
        }
      } else if (qType === 'truefalse') {
        const stmts = q.statements ?? [];
        if (stmts.length < 2 || stmts.some((s) => !s.text.trim())) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Đúng/Sai) cần ít nhất 2 mệnh đề hợp lệ.`);
          onNotify('error', `Câu hỏi ${i + 1} thiếu mệnh đề.`);
          return;
        }
      } else if (qType === 'short') {
        const sas = q.shortAnswers ?? [];
        if (sas.length === 0 || sas.some((s) => !s.trim())) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Điền ngắn) cần ít nhất 1 đáp án chấp nhận.`);
          onNotify('error', `Câu hỏi ${i + 1} thiếu đáp án ngắn.`);
          return;
        }
      } else if (qType === 'match') {
        const pairs = q.pairs ?? [];
        if (pairs.length < 2 || pairs.some((p) => !p.a.trim() || !p.b.trim())) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Ghép đôi) cần ít nhất 2 cặp hợp lệ.`);
          onNotify('error', `Câu hỏi ${i + 1} thiếu cặp ghép đôi.`);
          return;
        }
      } else if (qType === 'order') {
        const steps = q.orderSteps ?? [];
        if (steps.length < 2 || steps.some((s) => !s.trim())) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Sắp xếp) cần ít nhất 2 bước hợp lệ.`);
          onNotify('error', `Câu hỏi ${i + 1} thiếu bước sắp xếp.`);
          return;
        }
      } else if (qType === 'balance') {
        if (!q.balanceEquation?.trim() || !q.balanceCoefficients || q.balanceCoefficients.length === 0) {
          setErrorIndex(i);
          setErrorMessage(`Câu hỏi ${i + 1} (Cân bằng) thiếu phương trình hoặc hệ số.`);
          onNotify('error', `Câu hỏi ${i + 1} thiếu phương trình cân bằng.`);
          return;
        }
      }
    }
    setErrorIndex(null);
    setErrorMessage(null);
    onSave();
  };

  return (
    <div className="passport-frame rounded-[16px] bg-[#FBF8F1] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DAC3] pb-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#17262B]">
            Ngân hàng câu hỏi trắc nghiệm ({station.cauHoi.length} câu)
          </h2>
          <p className="text-xs text-[#4A5B60]">
            Học sinh cần trả lời đúng từ 60% trở lên để đóng dấu trạm. Hỗ trợ 7 dạng câu hỏi đa dạng.
          </p>
        </div>
        {station.cauHoi.length < 20 && (
          <button
            type="button"
            onClick={handleAddQuestion}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[12px] bg-[#137A6F] px-3.5 py-2 text-xs font-bold text-[#FBF8F1] hover:bg-[#0B3D3A]"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm câu hỏi</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-[12px] border border-[#C2553A]/40 bg-[#FBE9E3] p-3 text-xs font-semibold text-[#C2553A]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {station.cauHoi.map((q, qIdx) => {
          const qType = q.type ?? 'single';
          const isHasError = errorIndex === qIdx;

          return (
            <div
              key={qIdx}
              className={`space-y-4 rounded-[14px] border p-4 sm:p-5 transition-colors ${
                isHasError ? 'border-[#C2553A] bg-[#FBE9E3]/30' : 'border-[#E3DAC3] bg-[#F3EDDD]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DAC3]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#0B3D3A] px-3 py-1 text-xs font-bold text-[#FBF8F1]">
                    Câu hỏi {qIdx + 1}
                  </span>
                  <select
                    value={qType}
                    onChange={(e) => {
                      const nextType = e.target.value as QuestionType;
                      const nextQuiz = [...station.cauHoi];
                      // Initialize default structures based on type
                      let defaultOpts = q.dapAn ?? ['', '', '', ''];
                      let defaultCorrect = q.dapAnDung ?? 0;
                      let defaultStatements = q.statements ?? [
                        { text: '', isTrue: true },
                        { text: '', isTrue: false },
                        { text: '', isTrue: true },
                        { text: '', isTrue: false },
                      ];
                      let defaultShort = q.shortAnswers ?? [''];
                      let defaultPairs = q.pairs ?? [
                        { a: '', b: '' },
                        { a: '', b: '' },
                        { a: '', b: '' },
                      ];
                      let defaultOrder = q.orderSteps ?? ['', '', ''];
                      let defaultBalanceEq = q.balanceEquation ?? '{{CaCO3 + 2HCl -> CaCl2 + H2O + CO2}}';
                      let defaultCoeffs = q.balanceCoefficients ?? [1, 2, 1, 1, 1];

                      nextQuiz[qIdx] = {
                        ...q,
                        type: nextType,
                        dapAn: defaultOpts,
                        dapAnDung: defaultCorrect,
                        statements: defaultStatements,
                        shortAnswers: defaultShort,
                        pairs: defaultPairs,
                        orderSteps: defaultOrder,
                        balanceEquation: defaultBalanceEq,
                        balanceCoefficients: defaultCoeffs,
                      };
                      onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                    }}
                    className="rounded-[10px] border border-[#E3DAC3] bg-[#FBF8F1] px-3 py-1.5 text-xs font-bold text-[#17262B] focus:border-[#137A6F]"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(qIdx, 'up')}
                    disabled={qIdx === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F] disabled:opacity-40"
                    title="Chuyển lên"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(qIdx, 'down')}
                    disabled={qIdx === station.cauHoi.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F] disabled:opacity-40"
                    title="Chuyển xuống"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(qIdx)}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] text-[#137A6F] hover:bg-[#DCEFEA]"
                    title="Nhân đôi câu hỏi"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {station.cauHoi.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateStation((prev) => ({
                          ...prev,
                          cauHoi: prev.cauHoi.filter((_, idx) => idx !== qIdx),
                        }))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#C2553A]/35 bg-[#FBE9E3] text-[#C2553A] hover:bg-[#C2553A] hover:text-[#FBF8F1]"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Nội dung câu hỏi</label>
                <ChemTextField
                  value={q.cauHoi}
                  maxLength={500}
                  onChange={(nextVal) => {
                    const nextQuiz = [...station.cauHoi];
                    nextQuiz[qIdx] = { ...q, cauHoi: nextVal };
                    onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                  }}
                  className={INPUT_CLASS}
                />
              </div>

              <CoverImageField
                label="Ảnh minh họa câu hỏi (không bắt buộc, <300KB)"
                value={q.imageUrl ?? ''}
                alt={`Câu hỏi ${qIdx + 1}`}
                uploadButtonLabel="Tải ảnh lên"
                previewWidthClass="h-20 w-32"
                onChange={(nextImg) => {
                  const nextQuiz = [...station.cauHoi];
                  nextQuiz[qIdx] = { ...q, imageUrl: nextImg };
                  onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                }}
                onNotify={onNotify}
              />

              {/* Dynamic Type Editors */}
              {qType === 'single' && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {(q.dapAn ?? ['', '', '', '']).map((optText, optIdx) => {
                    const isCorrect = q.dapAnDung === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`rounded-[12px] border p-2.5 transition-colors ${
                          isCorrect ? 'border-[#2E8B57] bg-[#E4F4EA]' : 'border-[#E3DAC3] bg-[#FBF8F1]'
                        }`}
                      >
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#17262B]">Đáp án {String.fromCharCode(65 + optIdx)}</span>
                          <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#2E8B57]">
                            <input
                              type="radio"
                              name={`correct-${station.id}-${qIdx}`}
                              checked={isCorrect}
                              onChange={() => {
                                const nextQuiz = [...station.cauHoi];
                                nextQuiz[qIdx] = { ...q, dapAnDung: optIdx };
                                onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                              }}
                              className="h-4 w-4 accent-[#2E8B57]"
                            />
                            <span>Đáp án đúng</span>
                          </label>
                        </div>
                        <ChemTextField
                          value={optText}
                          compactToolbar
                          onChange={(nextVal) => {
                            const nextOpts = [...(q.dapAn ?? ['', '', '', ''])];
                            nextOpts[optIdx] = nextVal;
                            const nextQuiz = [...station.cauHoi];
                            nextQuiz[qIdx] = { ...q, dapAn: nextOpts };
                            onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                          }}
                          className={INPUT_CLASS}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {qType === 'multi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#4A5B60]">
                      Danh sách các đáp án (4 - 6 lựa chọn, tích chọn tất cả đáp án đúng):
                    </label>
                    {(q.dapAn ?? []).length < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextOpts = [...(q.dapAn ?? []), ''];
                          const nextQuiz = [...station.cauHoi];
                          nextQuiz[qIdx] = { ...q, dapAn: nextOpts };
                          onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                        }}
                        className="text-xs font-bold text-[#137A6F] underline"
                      >
                        + Thêm lựa chọn
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {(q.dapAn ?? ['', '', '', '']).map((optText, optIdx) => {
                      const isCorrect = (q.dapAnDungMulti ?? []).includes(optIdx);
                      return (
                        <div
                          key={optIdx}
                          className={`rounded-[12px] border p-2.5 transition-colors ${
                            isCorrect ? 'border-[#2E8B57] bg-[#E4F4EA]' : 'border-[#E3DAC3] bg-[#FBF8F1]'
                          }`}
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs font-bold text-[#17262B]">Lựa chọn {optIdx + 1}</span>
                            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#2E8B57]">
                              <input
                                type="checkbox"
                                checked={isCorrect}
                                onChange={(e) => {
                                  const currentM = q.dapAnDungMulti ?? [];
                                  const nextM = e.target.checked
                                    ? [...currentM, optIdx]
                                    : currentM.filter((i) => i !== optIdx);
                                  const nextQuiz = [...station.cauHoi];
                                  nextQuiz[qIdx] = { ...q, dapAnDungMulti: nextM };
                                  onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                                }}
                                className="h-4 w-4 accent-[#2E8B57]"
                              />
                              <span>Đáp án đúng</span>
                            </label>
                          </div>
                          <ChemTextField
                            value={optText}
                            compactToolbar
                            onChange={(nextVal) => {
                              const nextOpts = [...(q.dapAn ?? [])];
                              nextOpts[optIdx] = nextVal;
                              const nextQuiz = [...station.cauHoi];
                              nextQuiz[qIdx] = { ...q, dapAn: nextOpts };
                              onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                            }}
                            className={INPUT_CLASS}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {qType === 'truefalse' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#4A5B60]">
                    4 Mệnh đề (a, b, c, d) và xác định Đúng / Sai:
                  </label>
                  {(q.statements ?? []).map((st, stIdx) => (
                    <div key={stIdx} className="rounded-[10px] border border-[#E3DAC3] bg-[#FBF8F1] p-3">
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <ChemTextField
                            value={st.text}
                            compactToolbar
                            placeholder={`Mệnh đề ${String.fromCharCode(97 + stIdx)}...`}
                            onChange={(nextVal) => {
                              const nextStmts = [...(q.statements ?? [])];
                              nextStmts[stIdx] = { ...st, text: nextVal };
                              const nextQuiz = [...station.cauHoi];
                              nextQuiz[qIdx] = { ...q, statements: nextStmts };
                              onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                            }}
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <label className="inline-flex items-center gap-1 text-xs font-bold text-[#2E8B57]">
                            <input
                              type="radio"
                              name={`tf-${station.id}-${qIdx}-${stIdx}`}
                              checked={st.isTrue === true}
                              onChange={() => {
                                const nextStmts = [...(q.statements ?? [])];
                                nextStmts[stIdx] = { ...st, isTrue: true };
                                const nextQuiz = [...station.cauHoi];
                                nextQuiz[qIdx] = { ...q, statements: nextStmts };
                                onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                              }}
                              className="accent-[#2E8B57]"
                            />
                            <span>Đúng</span>
                          </label>
                          <label className="inline-flex items-center gap-1 text-xs font-bold text-[#C2553A]">
                            <input
                              type="radio"
                              name={`tf-${station.id}-${qIdx}-${stIdx}`}
                              checked={st.isTrue === false}
                              onChange={() => {
                                const nextStmts = [...(q.statements ?? [])];
                                nextStmts[stIdx] = { ...st, isTrue: false };
                                const nextQuiz = [...station.cauHoi];
                                nextQuiz[qIdx] = { ...q, statements: nextStmts };
                                onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                              }}
                              className="accent-[#C2553A]"
                            />
                            <span>Sai</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {qType === 'short' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#4A5B60]">
                      Danh sách các đáp án ngắn được chấp nhận (ví dụ: CO2, khí cacbonic):
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextSas = [...(q.shortAnswers ?? []), ''];
                        const nextQuiz = [...station.cauHoi];
                        nextQuiz[qIdx] = { ...q, shortAnswers: nextSas };
                        onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                      }}
                      className="text-xs font-bold text-[#137A6F] underline"
                    >
                      + Thêm đáp án
                    </button>
                  </div>
                  {(q.shortAnswers ?? ['']).map((sa, saIdx) => (
                    <div key={saIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sa}
                        placeholder="Nhập đáp án đúng..."
                        onChange={(e) => {
                          const nextSas = [...(q.shortAnswers ?? [])];
                          nextSas[saIdx] = e.target.value;
                          const nextQuiz = [...station.cauHoi];
                          nextQuiz[qIdx] = { ...q, shortAnswers: nextSas };
                          onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                        }}
                        className={INPUT_CLASS}
                      />
                      {(q.shortAnswers ?? []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextSas = (q.shortAnswers ?? []).filter((_, i) => i !== saIdx);
                            const nextQuiz = [...station.cauHoi];
                            nextQuiz[qIdx] = { ...q, shortAnswers: nextSas };
                            onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                          }}
                          className="px-3 py-2 text-xs font-bold text-[#C2553A] bg-[#FBE9E3] rounded-[8px]"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {qType === 'match' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#4A5B60]">
                      Các cặp ghép đôi (3 - 5 cặp, A tương ứng với B):
                    </label>
                    {(q.pairs ?? []).length < 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextPairs = [...(q.pairs ?? []), { a: '', b: '' }];
                          const nextQuiz = [...station.cauHoi];
                          nextQuiz[qIdx] = { ...q, pairs: nextPairs };
                          onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                        }}
                        className="text-xs font-bold text-[#137A6F] underline"
                      >
                        + Thêm cặp
                      </button>
                    )}
                  </div>
                  {(q.pairs ?? []).map((pair, pIdx) => (
                    <div key={pIdx} className="grid grid-cols-1 gap-2 rounded-[10px] border border-[#E3DAC3] bg-[#FBF8F1] p-3 sm:grid-cols-12 sm:items-center">
                      <div className="sm:col-span-6">
                        <input
                          type="text"
                          value={pair.a}
                          placeholder={`Cột A (Mục ${pIdx + 1})`}
                          onChange={(e) => {
                            const nextPairs = [...(q.pairs ?? [])];
                            nextPairs[pIdx] = { ...pair, a: e.target.value };
                            const nextQuiz = [...station.cauHoi];
                            nextQuiz[qIdx] = { ...q, pairs: nextPairs };
                            onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                          }}
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={pair.b}
                          placeholder={`Cột B (Đáp án tương ứng)`}
                          onChange={(e) => {
                            const nextPairs = [...(q.pairs ?? [])];
                            nextPairs[pIdx] = { ...pair, b: e.target.value };
                            const nextQuiz = [...station.cauHoi];
                            nextQuiz[qIdx] = { ...q, pairs: nextPairs };
                            onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                          }}
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="flex justify-end sm:col-span-1">
                        {(q.pairs ?? []).length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextPairs = (q.pairs ?? []).filter((_, i) => i !== pIdx);
                              const nextQuiz = [...station.cauHoi];
                              nextQuiz[qIdx] = { ...q, pairs: nextPairs };
                              onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                            }}
                            className="p-2 text-[#C2553A] hover:bg-[#FBE9E3] rounded-[8px]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {qType === 'order' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#4A5B60]">
                      Các bước theo đúng thứ tự chuẩn (3 - 6 bước):
                    </label>
                    {(q.orderSteps ?? []).length < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextSteps = [...(q.orderSteps ?? []), ''];
                          const nextQuiz = [...station.cauHoi];
                          nextQuiz[qIdx] = { ...q, orderSteps: nextSteps };
                          onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                        }}
                        className="text-xs font-bold text-[#137A6F] underline"
                      >
                        + Thêm bước
                      </button>
                    )}
                  </div>
                  {(q.orderSteps ?? []).map((stepText, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B3D3A] text-xs font-bold text-[#FBF8F1]">
                        {sIdx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <ChemTextField
                          value={stepText}
                          compactToolbar
                          placeholder={`Bước ${sIdx + 1}...`}
                          onChange={(nextVal) => {
                            const nextSteps = [...(q.orderSteps ?? [])];
                            nextSteps[sIdx] = nextVal;
                            const nextQuiz = [...station.cauHoi];
                            nextQuiz[qIdx] = { ...q, orderSteps: nextSteps };
                            onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                          }}
                          className={INPUT_CLASS}
                        />
                      </div>
                      {(q.orderSteps ?? []).length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextSteps = (q.orderSteps ?? []).filter((_, i) => i !== sIdx);
                            const nextQuiz = [...station.cauHoi];
                            nextQuiz[qIdx] = { ...q, orderSteps: nextSteps };
                            onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                          }}
                          className="p-2 text-[#C2553A] hover:bg-[#FBE9E3] rounded-[8px]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {qType === 'balance' && (
                <div className="space-y-3">
                  <div>
                    <label className={LABEL_CLASS}>Phương trình hóa học chưa cân bằng</label>
                    <ChemTextField
                      value={q.balanceEquation ?? ''}
                      placeholder="{{CaCO3 + HCl -> CaCl2 + H2O + CO2}}"
                      onChange={(nextVal) => {
                        const nextQuiz = [...station.cauHoi];
                        nextQuiz[qIdx] = { ...q, balanceEquation: nextVal };
                        onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Hệ số đúng tương ứng của từng chất (cách nhau bởi dấu phẩy, ví dụ: 1, 2, 1, 1, 1)</label>
                    <input
                      type="text"
                      value={(q.balanceCoefficients ?? []).join(', ')}
                      placeholder="1, 2, 1, 1, 1"
                      onChange={(e) => {
                        const coeffs = e.target.value.split(',').map((s) => parseInt(s.trim(), 10) || 1);
                        const nextQuiz = [...station.cauHoi];
                        nextQuiz[qIdx] = { ...q, balanceCoefficients: coeffs };
                        onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={LABEL_CLASS}>Giải thích đáp án đúng</label>
                <ChemTextField
                  multiline
                  rows={2}
                  value={q.giaiThich}
                  maxLength={1000}
                  onChange={(nextVal) => {
                    const nextQuiz = [...station.cauHoi];
                    nextQuiz[qIdx] = { ...q, giaiThich: nextVal };
                    onUpdateStation((prev) => ({ ...prev, cauHoi: nextQuiz }));
                  }}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#E3DAC3] pt-4">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] px-4 py-2 text-sm font-semibold text-[#137A6F] hover:bg-[#DCEFEA]"
        >
          <Eye className="h-4 w-4" />
          <span>Xem trước</span>
        </button>
        <button
          type="button"
          onClick={validateAndSave}
          disabled={saving}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-6 py-2 text-sm font-bold text-[#FBF8F1] hover:bg-[#137A6F] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#E2B857]" />}
          <span>Lưu Trạm {station.id}</span>
        </button>
      </div>
    </div>
  );
}
