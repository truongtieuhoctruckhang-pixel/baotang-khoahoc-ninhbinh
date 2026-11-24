import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, FlaskConical, X } from 'lucide-react';
import { RichHtmlWithChem, hasChemSyntaxError, parseChemSegments, useKatexReady } from '../lib/chem';
import {
  CHEM_QUICK_BUTTONS,
  SUPERSCRIPT_CHARGE_SUGGESTIONS,
  extractPlainTextFromHtml,
} from '../lib/chemParser';

interface RichTextEditorChemBarProps {
  htmlValue: string;
  onInsertPlainChem: (snippet: string, placeInsideBraces?: boolean) => void;
  onApplyChemScript: (mode: 'sub' | 'sup', rawScript: string) => void;
  onPrepareScriptButton: () => string;
  onRestoreSelection: () => void;
}

export function RichTextEditorChemBar({
  htmlValue,
  onInsertPlainChem,
  onApplyChemScript,
  onPrepareScriptButton,
  onRestoreSelection,
}: RichTextEditorChemBarProps) {
  const chemScriptInputRef = useRef<HTMLInputElement | null>(null);
  const [chemScriptPopover, setChemScriptPopover] = useState<'sub' | 'sup' | null>(null);
  const [chemScriptInput, setChemScriptInput] = useState('');

  useEffect(() => {
    if (chemScriptPopover) {
      window.requestAnimationFrame(() => {
        chemScriptInputRef.current?.focus();
      });
    }
  }, [chemScriptPopover]);

  const plain = useMemo(() => extractPlainTextFromHtml(htmlValue), [htmlValue]);
  const needsKatex = plain.includes('{{') || plain.includes('}}') || plain.includes('_') || plain.includes('^');
  const katexReady = useKatexReady(needsKatex);

  const hasRenderedChem = useMemo(
    () => parseChemSegments(plain).some((s) => s.type === 'chem' || s.type === 'error'),
    [plain, katexReady]
  );
  const hasFormula = plain.includes('{{') || plain.includes('}}') || hasRenderedChem;
  const syntaxStatus = useMemo(() => hasChemSyntaxError(plain), [plain, katexReady]);

  const handleScriptButtonClick = (mode: 'sub' | 'sup') => {
    const selectedText = onPrepareScriptButton();
    if (selectedText) {
      onApplyChemScript(mode, selectedText);
      return;
    }
    setChemScriptInput('');
    setChemScriptPopover((prev) => (prev === mode ? null : mode));
  };

  const applyAndClose = (mode: 'sub' | 'sup', raw: string) => {
    onApplyChemScript(mode, raw);
    setChemScriptPopover(null);
    setChemScriptInput('');
  };

  return (
    <div className="space-y-2 border-t border-[#E3DAC3] bg-[#F3EDDD]/70 p-2.5">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsertPlainChem('{{}}', true)}
          title="Chèn cặp dấu {{ }} và đặt con trỏ vào giữa"
          className="inline-flex h-7 items-center gap-1 rounded-[7px] bg-[#0B3D3A] px-2.5 text-[11px] font-bold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
        >
          <FlaskConical className="h-3 w-3 text-[#E2B857]" />
          <span>Chèn công thức</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleScriptButtonClick('sub')}
          title="Bôi đen chữ rồi bấm để chuyển thành chỉ số dưới, hoặc bấm để nhập số bất kỳ"
          className={`inline-flex h-7 items-center gap-1 rounded-[7px] border px-2 text-[11px] font-bold transition-colors ${
            chemScriptPopover === 'sub'
              ? 'border-[#137A6F] bg-[#DCEFEA] text-[#0B3D3A]'
              : 'border-[#D5C9AA] bg-[#FBF8F1] text-[#0B3D3A] hover:border-[#137A6F] hover:bg-[#DCEFEA]'
          }`}
        >
          <span>
            X<sub>(n)</sub>
          </span>
          <span>Chỉ số dưới</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleScriptButtonClick('sup')}
          title="Bôi đen chữ rồi bấm để chuyển thành chỉ số trên / điện tích, hoặc bấm để chọn nhanh +, 2+, 3+, -, 2-, 3-"
          className={`inline-flex h-7 items-center gap-1 rounded-[7px] border px-2 text-[11px] font-bold transition-colors ${
            chemScriptPopover === 'sup'
              ? 'border-[#137A6F] bg-[#DCEFEA] text-[#0B3D3A]'
              : 'border-[#D5C9AA] bg-[#FBF8F1] text-[#0B3D3A] hover:border-[#137A6F] hover:bg-[#DCEFEA]'
          }`}
        >
          <span>
            X<sup>(n)</sup>
          </span>
          <span>Chỉ số trên / điện tích</span>
        </button>

        {CHEM_QUICK_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onInsertPlainChem(btn.insert)}
            title={btn.title}
            className="inline-flex h-7 min-w-[26px] items-center justify-center rounded-[7px] border border-[#E3DAC3] bg-[#FBF8F1] px-1.5 text-xs font-semibold text-[#17262B] transition-colors hover:border-[#137A6F] hover:bg-[#DCEFEA]"
          >
            {btn.label}
          </button>
        ))}

        {syntaxStatus.hasError && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-[7px] bg-[#FBE9E3] px-2 py-0.5 text-[11px] font-semibold text-[#C2553A]">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>Công thức sai cú pháp</span>
          </span>
        )}
      </div>

      {chemScriptPopover && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-[8px] border border-[#137A6F]/35 bg-[#FBF8F1] p-2">
          <span className="text-[11px] font-bold text-[#0B3D3A]">
            {chemScriptPopover === 'sub' ? 'Nhập chỉ số dưới:' : 'Chọn hoặc nhập điện tích:'}
          </span>

          {chemScriptPopover === 'sup' && (
            <div className="flex flex-wrap items-center gap-1">
              {SUPERSCRIPT_CHARGE_SUGGESTIONS.map((charge) => (
                <button
                  key={charge}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAndClose('sup', charge)}
                  className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-[6px] border border-[#E3DAC3] bg-[#F3EDDD] px-1.5 text-[11px] font-bold text-[#0B3D3A] hover:border-[#137A6F] hover:bg-[#DCEFEA]"
                >
                  {charge}
                </button>
              ))}
            </div>
          )}

          <input
            ref={chemScriptInputRef}
            type="text"
            value={chemScriptInput}
            onChange={(e) => setChemScriptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyAndClose(chemScriptPopover, chemScriptInput);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setChemScriptPopover(null);
                setChemScriptInput('');
                onRestoreSelection();
              }
            }}
            placeholder={chemScriptPopover === 'sub' ? 'vd: 12, 22, n...' : 'vd: 4+, n...'}
            className="h-7 min-w-[110px] flex-1 rounded-[6px] border border-[#E3DAC3] bg-[#FBF8F1] px-2 text-xs text-[#17262B] focus:border-[#137A6F] focus:outline-none"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyAndClose(chemScriptPopover, chemScriptInput)}
            className="h-7 rounded-[6px] bg-[#0B3D3A] px-2.5 text-[11px] font-bold text-[#FBF8F1] hover:bg-[#137A6F]"
          >
            Chèn
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setChemScriptPopover(null);
              setChemScriptInput('');
              onRestoreSelection();
            }}
            aria-label="Đóng"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[#4A5B60] hover:bg-[#F3EDDD]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {hasFormula && (
        <div
          className={`rounded-[10px] border bg-[#FBF8F1] p-3 text-sm ${
            syntaxStatus.hasError ? 'border-[#C2553A]/45' : 'border-[#137A6F]/30'
          }`}
        >
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span className={syntaxStatus.hasError ? 'text-[#C2553A]' : 'text-[#137A6F]'}>
              Xem trước công thức trong bài viết
            </span>
            {syntaxStatus.hasError && (
              <span className="font-semibold normal-case text-[#C2553A]">
                {syntaxStatus.firstError}
              </span>
            )}
          </div>
          <div className="max-h-52 overflow-auto">
            <RichHtmlWithChem html={htmlValue} />
          </div>
        </div>
      )}
    </div>
  );
}
