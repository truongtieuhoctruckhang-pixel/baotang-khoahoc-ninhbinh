import { useEffect, useRef, type KeyboardEvent } from 'react';
import { AlertTriangle, FlaskConical, X } from 'lucide-react';
import { CHEM_QUICK_BUTTONS, SUPERSCRIPT_CHARGE_SUGGESTIONS } from '../lib/chemParser';

export type ScriptPopoverMode = 'sub' | 'sup' | null;

interface ChemToolbarBarProps {
  formulaMode: boolean;
  compactToolbar?: boolean;
  scriptPopover: ScriptPopoverMode;
  scriptInput: string;
  syntaxStatus: { hasError: boolean; firstError: string | null };
  onToggleFormulaMode: () => void;
  onInsertSnippet: (snippet: string, cursorOffsetInside?: number) => void;
  onSmartScriptButton: (mode: 'sub' | 'sup') => void;
  onScriptInputChange: (val: string) => void;
  onApplyScript: (mode: 'sub' | 'sup', rawScript: string) => void;
  onClosePopover: () => void;
}

export function ChemToolbarBar({
  formulaMode,
  compactToolbar = false,
  scriptPopover,
  scriptInput,
  syntaxStatus,
  onToggleFormulaMode,
  onInsertSnippet,
  onSmartScriptButton,
  onScriptInputChange,
  onApplyScript,
  onClosePopover,
}: ChemToolbarBarProps) {
  const scriptInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scriptPopover) {
      window.requestAnimationFrame(() => {
        scriptInputRef.current?.focus();
      });
    }
  }, [scriptPopover]);

  const handleScriptInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (scriptPopover) {
        onApplyScript(scriptPopover, scriptInput);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClosePopover();
    }
  };

  return (
    <div className="space-y-1.5 rounded-[10px] border border-[#E3DAC3] bg-[#F3EDDD]/75 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          role="switch"
          aria-checked={formulaMode}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggleFormulaMode}
          title="Khi bật, toàn bộ ô được hiểu là công thức hóa học (mhchem): H2SO4, C12H22O11, Al2(SO4)3, 2Fe2O3"
          className={`inline-flex h-7 items-center gap-1.5 rounded-[7px] border px-2 text-[11px] font-bold transition-colors ${
            formulaMode
              ? 'border-[#0B3D3A] bg-[#0B3D3A] text-[#FBF8F1]'
              : 'border-[#D5C9AA] bg-[#FBF8F1] text-[#17262B] hover:border-[#137A6F]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors ${
              formulaMode ? 'bg-[#137A6F]' : 'bg-[#D5C9AA]'
            }`}
          >
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full bg-[#FBF8F1] shadow transition-transform ${
                formulaMode ? 'translate-x-3' : 'translate-x-0.5'
              }`}
            />
          </span>
          <span>Chế độ công thức</span>
        </button>

        {!formulaMode && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onInsertSnippet('{{}}', 2)}
            title="Chèn cặp dấu {{ }} và đặt con trỏ vào giữa"
            className="inline-flex h-7 items-center gap-1 rounded-[7px] bg-[#0B3D3A] px-2 text-[11px] font-bold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
          >
            <FlaskConical className="h-3 w-3 text-[#E2B857]" />
            <span>{compactToolbar ? 'Công thức' : 'Chèn công thức'}</span>
          </button>
        )}

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSmartScriptButton('sub')}
          title="Bôi đen chữ rồi bấm để chuyển thành chỉ số dưới, hoặc bấm để nhập số bất kỳ (vd: 12)"
          className={`inline-flex h-7 items-center gap-1 rounded-[7px] border px-2 text-[11px] font-bold transition-colors ${
            scriptPopover === 'sub'
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
          onClick={() => onSmartScriptButton('sup')}
          title="Bôi đen chữ rồi bấm để chuyển thành chỉ số trên / điện tích, hoặc bấm để chọn nhanh +, 2+, 3+, -, 2-, 3-"
          className={`inline-flex h-7 items-center gap-1 rounded-[7px] border px-2 text-[11px] font-bold transition-colors ${
            scriptPopover === 'sup'
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
            onClick={() => onInsertSnippet(btn.insert)}
            title={btn.title}
            className="inline-flex h-7 min-w-[26px] items-center justify-center rounded-[7px] border border-[#E3DAC3] bg-[#FBF8F1] px-1.5 text-xs font-semibold text-[#17262B] transition-colors hover:border-[#137A6F] hover:bg-[#DCEFEA]"
          >
            {btn.label}
          </button>
        ))}

        {syntaxStatus.hasError && (
          <span
            title={syntaxStatus.firstError ?? 'Công thức hóa học sai cú pháp'}
            className="ml-auto inline-flex items-center gap-1 rounded-[7px] bg-[#FBE9E3] px-2 py-0.5 text-[11px] font-semibold text-[#C2553A]"
          >
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>Công thức sai cú pháp</span>
          </span>
        )}
      </div>

      {scriptPopover && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-[8px] border border-[#137A6F]/35 bg-[#FBF8F1] p-2">
          <span className="text-[11px] font-bold text-[#0B3D3A]">
            {scriptPopover === 'sub' ? 'Nhập chỉ số dưới:' : 'Chọn hoặc nhập điện tích:'}
          </span>

          {scriptPopover === 'sup' && (
            <div className="flex flex-wrap items-center gap-1">
              {SUPERSCRIPT_CHARGE_SUGGESTIONS.map((charge) => (
                <button
                  key={charge}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onApplyScript('sup', charge)}
                  className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-[6px] border border-[#E3DAC3] bg-[#F3EDDD] px-1.5 text-[11px] font-bold text-[#0B3D3A] hover:border-[#137A6F] hover:bg-[#DCEFEA]"
                >
                  {charge}
                </button>
              ))}
            </div>
          )}

          <input
            ref={scriptInputRef}
            type="text"
            value={scriptInput}
            onChange={(e) => onScriptInputChange(e.target.value)}
            onKeyDown={handleScriptInputKeyDown}
            placeholder={scriptPopover === 'sub' ? 'vd: 12, 22, n...' : 'vd: 4+, n...'}
            className="h-7 min-w-[110px] flex-1 rounded-[6px] border border-[#E3DAC3] bg-[#FBF8F1] px-2 text-xs text-[#17262B] focus:border-[#137A6F] focus:outline-none"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onApplyScript(scriptPopover, scriptInput)}
            className="h-7 rounded-[6px] bg-[#0B3D3A] px-2.5 text-[11px] font-bold text-[#FBF8F1] hover:bg-[#137A6F]"
          >
            Chèn
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClosePopover}
            aria-label="Đóng"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[#4A5B60] hover:bg-[#F3EDDD]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
