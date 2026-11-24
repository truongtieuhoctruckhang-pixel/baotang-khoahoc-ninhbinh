import { useEffect, useRef, useState } from 'react';
import { sanitizeRichHtml } from '../lib/sanitize';
import { RichTextEditorChemBar } from './RichTextEditorChemBar';
import { RichTextEditorToolbar, type RichPopoverTarget } from './RichTextEditorToolbar';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClass?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết tại đây...',
  minHeightClass = 'min-h-[280px]',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [activePopover, setActivePopover] = useState<RichPopoverTarget>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const clean = sanitizeRichHtml(value);
    if (el.innerHTML !== clean) {
      el.innerHTML = clean;
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const emitHtml = () => {
    const el = editorRef.current;
    if (!el) return;
    onChange(sanitizeRichHtml(el.innerHTML));
  };

  const execCommand = (command: string, val?: string) => {
    restoreSelection();
    document.execCommand(command, false, val);
    saveSelection();
    emitHtml();
  };

  const insertHtmlAtCursor = (htmlSnippet: string) => {
    restoreSelection();
    const clean = sanitizeRichHtml(htmlSnippet);
    document.execCommand('insertHTML', false, clean);
    saveSelection();
    emitHtml();
  };

  const insertPlainChemAtCursor = (snippet: string, placeInsideBraces = false) => {
    restoreSelection();
    const sel = window.getSelection();
    const selectedText = sel && !sel.isCollapsed ? sel.toString() : '';

    if (placeInsideBraces && selectedText) {
      document.execCommand('insertText', false, `{{${selectedText}}}`);
      saveSelection();
      emitHtml();
      return;
    }

    document.execCommand('insertText', false, snippet);
    if (placeInsideBraces && sel && sel.focusNode && sel.focusNode.nodeType === Node.TEXT_NODE) {
      const offset = sel.focusOffset;
      if (offset >= 2) {
        const range = document.createRange();
        range.setStart(sel.focusNode, offset - 2);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    saveSelection();
    emitHtml();
  };

  const applyRichChemScript = (mode: 'sub' | 'sup', rawScript: string) => {
    const trimmed = rawScript.trim();
    if (!trimmed) return;
    restoreSelection();
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    const nodeText = range?.startContainer?.textContent ?? '';
    const offset = range?.startOffset ?? 0;
    const before = nodeText.slice(0, offset);
    const after = nodeText.slice(range?.endOffset ?? offset);

    const lastOpen = before.lastIndexOf('{{');
    const lastClose = before.lastIndexOf('}}');
    const nextClose = after.indexOf('}}');
    const nextOpen = after.indexOf('{{');
    const insideBraces =
      lastOpen !== -1 &&
      lastOpen > lastClose &&
      nextClose !== -1 &&
      (nextOpen === -1 || nextClose < nextOpen);

    const token =
      mode === 'sub'
        ? /^[0-9]+$/.test(trimmed)
          ? `_${trimmed}`
          : `_{${trimmed}}`
        : /^(?:[0-9]*[+-]|[0-9]+)$/.test(trimmed)
          ? `^${trimmed}`
          : `^{${trimmed}}`;

    let snippet = token;
    if (!insideBraces) {
      const isSimpleShortcut =
        mode === 'sub' ? /^[0-9]+$/.test(trimmed) : /^(?:[0-9]*[+-]|[0-9]+)$/.test(trimmed);
      const hasChemPrefix = /(?:^|[\s(\[,:;+=→⇌])(?:\d+)?[A-Za-z][A-Za-z0-9()_^-]*$/.test(
        before
      );
      if (!(isSimpleShortcut && hasChemPrefix)) {
        snippet = `{{${token}}}`;
      }
    }

    document.execCommand('insertText', false, snippet);
    saveSelection();
    emitHtml();
  };

  const handlePrepareScriptButton = (): string => {
    saveSelection();
    const sel = window.getSelection();
    return sel && !sel.isCollapsed ? sel.toString().trim() : '';
  };

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#E3DAC3] bg-[#FBF8F1]">
      <RichTextEditorToolbar
        activePopover={activePopover}
        onTogglePopover={(target) => {
          saveSelection();
          setActivePopover((prev) => (prev === target ? null : target));
        }}
        onClosePopover={() => setActivePopover(null)}
        onExecCommand={execCommand}
        onInsertHtml={insertHtmlAtCursor}
      />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitHtml}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onBlur={() => {
          saveSelection();
          emitHtml();
        }}
        className={`cms-prose ${minHeightClass} max-h-[520px] overflow-y-auto px-4 py-3.5 text-sm leading-relaxed text-[#17262B] focus:outline-none`}
      />

      <RichTextEditorChemBar
        htmlValue={value}
        onInsertPlainChem={insertPlainChemAtCursor}
        onApplyChemScript={applyRichChemScript}
        onPrepareScriptButton={handlePrepareScriptButton}
        onRestoreSelection={restoreSelection}
      />
    </div>
  );
}

export default RichTextEditor;
