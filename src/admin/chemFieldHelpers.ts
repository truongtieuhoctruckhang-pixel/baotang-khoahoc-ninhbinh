export function isCursorInsideBraces(text: string, start: number, end: number): boolean {
  const before = text.slice(0, start);
  const lastOpen = before.lastIndexOf('{{');
  const lastClose = before.lastIndexOf('}}');
  if (lastOpen === -1 || lastOpen < lastClose) return false;
  const after = text.slice(end);
  const nextClose = after.indexOf('}}');
  const nextOpen = after.indexOf('{{');
  return nextClose !== -1 && (nextOpen === -1 || nextClose < nextOpen);
}

export function formatSubscriptToken(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return /^[0-9]+$/.test(trimmed) ? `_${trimmed}` : `_{${trimmed}}`;
}

export function formatSuperscriptToken(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return /^(?:[0-9]*[+-]|[0-9]+)$/.test(trimmed) ? `^${trimmed}` : `^{${trimmed}}`;
}

export function computeScriptInsertion(
  displayValue: string,
  formulaMode: boolean,
  mode: 'sub' | 'sup',
  rawScript: string,
  range: { start: number; end: number }
): { nextDisplay: string; nextCursorPos: number } | null {
  const trimmed = rawScript.trim();
  if (!trimmed) return null;

  const { start, end } = range;
  const token = mode === 'sub' ? formatSubscriptToken(trimmed) : formatSuperscriptToken(trimmed);
  const before = displayValue.slice(0, start);
  const after = displayValue.slice(end);
  const insideFormulaContext = formulaMode || isCursorInsideBraces(displayValue, start, end);

  if (insideFormulaContext) {
    return {
      nextDisplay: `${before}${token}${after}`,
      nextCursorPos: start + token.length,
    };
  }

  const isSimpleShortcut =
    mode === 'sub'
      ? /^[0-9]+$/.test(trimmed)
      : /^(?:[0-9]*[+-]|[0-9]+)$/.test(trimmed);
  const chemPrefixMatch = before.match(
    /(?:^|[\s(\[,:;+=→⇌])((?:\d+)?[A-Za-z][A-Za-z0-9()_^-]*)$/
  );

  if (isSimpleShortcut && chemPrefixMatch) {
    return {
      nextDisplay: `${before}${token}${after}`,
      nextCursorPos: start + token.length,
    };
  }

  if (chemPrefixMatch) {
    const prefix = chemPrefixMatch[1];
    const prefixStart = before.length - prefix.length;
    const wrapped = `{{${prefix}${token}}}`;
    return {
      nextDisplay: `${before.slice(0, prefixStart)}${wrapped}${after}`,
      nextCursorPos: prefixStart + wrapped.length,
    };
  }

  const wrapped = `{{${token}}}`;
  return {
    nextDisplay: `${before}${wrapped}${after}`,
    nextCursorPos: start + wrapped.length,
  };
}
