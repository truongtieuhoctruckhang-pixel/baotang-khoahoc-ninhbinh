import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ChemText, hasChemSyntaxError, parseChemSegments, useKatexReady } from '../lib/chem';
import {
  isWholeFormulaWrapped,
  unwrapWholeFormula,
  wrapWholeFormula,
} from '../lib/chemParser';
import { ChemToolbarBar, type ScriptPopoverMode } from './ChemToolbarBar';
import { computeScriptInsertion } from './chemFieldHelpers';

interface ChemTextFieldProps {
  value: string;
  onChange: (nextValue: string) => void;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  alwaysShowPreview?: boolean;
  compactToolbar?: boolean;
}

export function ChemTextField({
  value,
  onChange,
  multiline = false,
  rows = 3,
  maxLength,
  placeholder,
  className = '',
  alwaysShowPreview = false,
  compactToolbar = false,
}: ChemTextFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastEmittedRef = useRef<string>(value);
  const pendingRangeRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const [formulaMode, setFormulaMode] = useState<boolean>(() => isWholeFormulaWrapped(value));
  const [scriptPopover, setScriptPopover] = useState<ScriptPopoverMode>(null);
  const [scriptInput, setScriptInput] = useState<string>('');

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      setFormulaMode(isWholeFormulaWrapped(value));
      setScriptPopover(null);
      setScriptInput('');
    }
  }, [value]);

  const displayValue = useMemo(() => {
    if (!formulaMode) return value;
    return isWholeFormulaWrapped(value) ? unwrapWholeFormula(value) : value;
  }, [formulaMode, value]);

  const effectiveMaxLength = useMemo(() => {
    if (!maxLength) return undefined;
    return formulaMode ? Math.max(1, maxLength - 4) : maxLength;
  }, [maxLength, formulaMode]);

  const getFieldEl = (): HTMLInputElement | HTMLTextAreaElement | null =>
    multiline ? textareaRef.current : inputRef.current;

  const emitDisplayValue = (nextDisplayRaw: string, nextFormulaMode = formulaMode) => {
    const cleanedDisplay =
      nextFormulaMode && isWholeFormulaWrapped(nextDisplayRaw)
        ? unwrapWholeFormula(nextDisplayRaw)
        : nextDisplayRaw;

    let nextStored = nextFormulaMode
      ? cleanedDisplay.length > 0
        ? wrapWholeFormula(cleanedDisplay)
        : ''
      : cleanedDisplay;

    if (maxLength && nextStored.length > maxLength) {
      if (nextFormulaMode && nextStored.startsWith('{{') && nextStored.endsWith('}}')) {
        const clampedInner = cleanedDisplay.slice(0, Math.max(0, maxLength - 4));
        nextStored = clampedInner.length > 0 ? wrapWholeFormula(clampedInner) : '';
      } else {
        nextStored = nextStored.slice(0, maxLength);
      }
    }

    lastEmittedRef.current = nextStored;
    onChange(nextStored);
  };

  const handleToggleFormulaMode = () => {
    const nextMode = !formulaMode;
    setFormulaMode(nextMode);
    setScriptPopover(null);
    const unwrapped = isWholeFormulaWrapped(value) ? unwrapWholeFormula(value) : value;
    emitDisplayValue(unwrapped, nextMode);
  };

  const focusAndSetCursor = (pos: number) => {
    window.requestAnimationFrame(() => {
      const target = getFieldEl();
      if (!target) return;
      target.focus();
      const clamped = Math.max(0, Math.min(pos, target.value.length));
      target.setSelectionRange(clamped, clamped);
    });
  };

  const insertAtCursor = (snippet: string, cursorOffsetInside?: number) => {
    const el = getFieldEl();
    if (!el) {
      emitDisplayValue(`${displayValue}${snippet}`);
      return;
    }

    const start = el.selectionStart ?? displayValue.length;
    const end = el.selectionEnd ?? displayValue.length;
    const selected = displayValue.slice(start, end);

    let inserted = snippet;
    let nextCursorPos = start + snippet.length;

    if (snippet === '{{}}' && selected) {
      inserted = `{{${selected}}}`;
      nextCursorPos = start + inserted.length;
    } else if (typeof cursorOffsetInside === 'number') {
      nextCursorPos = start + cursorOffsetInside;
    }

    const nextDisplay = `${displayValue.slice(0, start)}${inserted}${displayValue.slice(end)}`;
    emitDisplayValue(nextDisplay);
    focusAndSetCursor(nextCursorPos);
  };

  const applyScriptAtRange = (
    mode: 'sub' | 'sup',
    rawScript: string,
    range: { start: number; end: number }
  ) => {
    const result = computeScriptInsertion(displayValue, formulaMode, mode, rawScript, range);
    if (!result) return;
    emitDisplayValue(result.nextDisplay);
    setScriptPopover(null);
    setScriptInput('');
    focusAndSetCursor(result.nextCursorPos);
  };

  const handleSmartScriptButton = (mode: 'sub' | 'sup') => {
    const el = getFieldEl();
    const start = el?.selectionStart ?? displayValue.length;
    const end = el?.selectionEnd ?? displayValue.length;

    if (end > start) {
      applyScriptAtRange(mode, displayValue.slice(start, end), { start, end });
      return;
    }

    pendingRangeRef.current = { start, end };
    setScriptInput('');
    setScriptPopover((prev) => (prev === mode ? null : mode));
  };

  const previewText = useMemo(() => {
    if (formulaMode) {
      return displayValue.trim() ? wrapWholeFormula(displayValue) : '';
    }
    return value;
  }, [formulaMode, displayValue, value]);

  const needsKatex =
    formulaMode ||
    value.includes('{{') ||
    value.includes('}}') ||
    value.includes('_') ||
    value.includes('^');
  const katexReady = useKatexReady(needsKatex);

  const syntaxStatus = useMemo(
    () => hasChemSyntaxError(formulaMode ? displayValue : value, formulaMode),
    [formulaMode, displayValue, value, katexReady]
  );

  const hasRenderedChem = useMemo(() => {
    if (!previewText) return false;
    return parseChemSegments(previewText).some((s) => s.type === 'chem' || s.type === 'error');
  }, [previewText, katexReady]);

  const showPreviewBox =
    formulaMode ||
    value.includes('{{') ||
    value.includes('}}') ||
    hasRenderedChem ||
    (alwaysShowPreview && displayValue.trim().length > 0);

  const effectivePlaceholder = formulaMode
    ? 'Ví dụ: H2SO4, C12H22O11, Al2(SO4)3, 2Fe2O3'
    : placeholder;

  return (
    <div className="space-y-1.5">
      {multiline ? (
        <textarea
          ref={textareaRef}
          rows={rows}
          value={displayValue}
          maxLength={effectiveMaxLength}
          placeholder={effectivePlaceholder}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => emitDisplayValue(e.target.value)}
          className={className}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          maxLength={effectiveMaxLength}
          placeholder={effectivePlaceholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) => emitDisplayValue(e.target.value)}
          className={className}
        />
      )}

      <ChemToolbarBar
        formulaMode={formulaMode}
        compactToolbar={compactToolbar}
        scriptPopover={scriptPopover}
        scriptInput={scriptInput}
        syntaxStatus={syntaxStatus}
        onToggleFormulaMode={handleToggleFormulaMode}
        onInsertSnippet={insertAtCursor}
        onSmartScriptButton={handleSmartScriptButton}
        onScriptInputChange={setScriptInput}
        onApplyScript={(mode, raw) => applyScriptAtRange(mode, raw, pendingRangeRef.current)}
        onClosePopover={() => {
          setScriptPopover(null);
          setScriptInput('');
          focusAndSetCursor(pendingRangeRef.current.end);
        }}
      />

      {showPreviewBox && (
        <div
          className={`rounded-[10px] border px-3 py-2 text-sm leading-relaxed ${
            syntaxStatus.hasError
              ? 'border-[#C2553A]/45 bg-[#FBE9E3]/55'
              : 'border-[#137A6F]/30 bg-[#DCEFEA]/35'
          }`}
        >
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span className={syntaxStatus.hasError ? 'text-[#C2553A]' : 'text-[#137A6F]'}>
              Xem trước{formulaMode ? ' (Chế độ công thức)' : ''}
            </span>
            {syntaxStatus.hasError && (
              <span className="inline-flex items-center gap-1 font-semibold normal-case text-[#C2553A]">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                <span>Giữ nguyên chữ gốc do lỗi cú pháp ({syntaxStatus.firstError})</span>
              </span>
            )}
          </div>
          <div className="overflow-x-auto text-[#17262B]">
            {previewText.trim().length > 0 ? (
              <ChemText text={previewText} />
            ) : (
              <span className="text-xs italic text-[#4A5B60]">
                Gõ công thức (vd: H2SO4, C12H22O11, Al2(SO4)3, 2Fe2O3)...
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
