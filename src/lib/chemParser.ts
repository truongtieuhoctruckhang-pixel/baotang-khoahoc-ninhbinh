import { sanitizeRichHtml } from './sanitize';

export interface ParsedChemToken {
  type: 'text' | 'chem' | 'error';
  raw: string;
  expr?: string;
  error?: string;
}

export const CHEM_QUICK_BUTTONS: ReadonlyArray<{
  label: string;
  insert: string;
  title: string;
}> = [
  { label: '→', insert: '→', title: 'Mũi tên phản ứng' },
  { label: '⇌', insert: '⇌', title: 'Mũi tên thuận nghịch' },
  { label: '↑', insert: '↑', title: 'Khí bay lên' },
  { label: '↓', insert: '↓', title: 'Kết tủa' },
  { label: 'Δ', insert: 'Δ', title: 'Nhiệt độ / Biến thiên' },
  { label: '°C', insert: '°C', title: 'Độ C' },
];

export const SUPERSCRIPT_CHARGE_SUGGESTIONS: ReadonlyArray<string> = [
  '+',
  '2+',
  '3+',
  '-',
  '2-',
  '3-',
];

const UNICODE_SUBSCRIPTS: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

// Nhận diện công thức gõ tắt bằng "_" (vd: H_12, C_12H_22O_11) hoặc "^" (vd: Ca^2+, CO_3^2-)
const SHORTCUT_CHEM_REGEX =
  /(^|[\s(\[,:;+=→⇌])((?:\d+)?(?:[A-Z][a-z]?|\([A-Za-z0-9_]+\))(?:[A-Za-z0-9()]|_[0-9]+|\^(?:[0-9]*[+-]|[0-9]+))*(?:_[0-9]+|\^(?:[0-9]*[+-]|[0-9]+))+(?:[A-Za-z0-9()]|_[0-9]+|\^(?:[0-9]*[+-]|[0-9]+))*)/g;

export function isWholeFormulaWrapped(val: string): boolean {
  const trimmed = val.trim();
  if (!trimmed.startsWith('{{') || !trimmed.endsWith('}}') || trimmed.length < 4) {
    return false;
  }
  const inner = trimmed.slice(2, -2);
  return !inner.includes('{{') && !inner.includes('}}');
}

export function unwrapWholeFormula(val: string): string {
  if (!isWholeFormulaWrapped(val)) return val;
  return val.trim().slice(2, -2);
}

export function wrapWholeFormula(inner: string): string {
  if (!inner) return '';
  return `{{${inner}}}`;
}

export function preprocessChemExpression(rawExpr: string): string {
  const trimmed = rawExpr.trim();
  if (!trimmed) return '';

  let normalized = trimmed
    .replace(/→/g, '->')
    .replace(/⇌/g, '<=>')
    .replace(/↑/g, '^')
    .replace(/↓/g, ' v')
    .replace(/²⁺/g, '^2+')
    .replace(/²⁻/g, '^2-')
    .replace(/³⁺/g, '^3+')
    .replace(/³⁻/g, '^3-')
    .replace(/⁺/g, '+')
    .replace(/⁻/g, '-')
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/[₀-₉]/g, (ch) => UNICODE_SUBSCRIPTS[ch] ?? ch);

  const parts = normalized.split(/(\[[^\]]*\])/g);
  normalized = parts
    .map((part, idx) => {
      if (idx % 2 === 1) return part;
      return part.replace(/([0-9)\]]|[A-Z][a-z]?)v(?=$|\s|[+,;.])/g, '$1 v');
    })
    .join('');

  if (/^\\(?:ce|pu)\s*\{/.test(normalized)) {
    return normalized;
  }

  return `\\ce{${normalized}}`;
}

function tokenizeShortcuts(plain: string): ParsedChemToken[] {
  if (!plain) return [];
  if (!plain.includes('_') && !plain.includes('^')) {
    return [{ type: 'text', raw: plain }];
  }

  const tokens: ParsedChemToken[] = [];
  let lastIdx = 0;
  SHORTCUT_CHEM_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SHORTCUT_CHEM_REGEX.exec(plain)) !== null) {
    const prefix = match[1] ?? '';
    const token = match[2] ?? '';
    const tokenStart = match.index + prefix.length;

    if (tokenStart > lastIdx) {
      tokens.push({ type: 'text', raw: plain.slice(lastIdx, tokenStart) });
    }
    tokens.push({ type: 'chem', raw: token, expr: token });
    lastIdx = tokenStart + token.length;
  }

  if (lastIdx < plain.length) {
    tokens.push({ type: 'text', raw: plain.slice(lastIdx) });
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', raw: plain }];
}

export function parseChemTokenList(input: string): ParsedChemToken[] {
  if (!input) return [];
  if (!input.includes('{{') && !input.includes('}}')) {
    return tokenizeShortcuts(input);
  }

  const tokens: ParsedChemToken[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    const openIdx = input.indexOf('{{', cursor);
    const strayCloseIdx = input.indexOf('}}', cursor);

    if (strayCloseIdx !== -1 && (openIdx === -1 || strayCloseIdx < openIdx)) {
      if (strayCloseIdx > cursor) {
        tokens.push(...tokenizeShortcuts(input.slice(cursor, strayCloseIdx)));
      }
      tokens.push({
        type: 'error',
        raw: '}}',
        error: 'Dấu đóng }} thừa (chưa có {{ tương ứng)',
      });
      cursor = strayCloseIdx + 2;
      continue;
    }

    if (openIdx === -1) {
      tokens.push(...tokenizeShortcuts(input.slice(cursor)));
      break;
    }

    if (openIdx > cursor) {
      tokens.push(...tokenizeShortcuts(input.slice(cursor, openIdx)));
    }

    const closeIdx = input.indexOf('}}', openIdx + 2);
    if (closeIdx === -1) {
      tokens.push({
        type: 'error',
        raw: input.slice(openIdx),
        error: 'Thiếu dấu đóng }} cho công thức hóa học',
      });
      break;
    }

    const rawToken = input.slice(openIdx, closeIdx + 2);
    const expr = input.slice(openIdx + 2, closeIdx);
    if (!expr.trim()) {
      tokens.push({
        type: 'error',
        raw: rawToken,
        expr,
        error: 'Công thức trống bên trong {{ }}',
      });
    } else {
      tokens.push({ type: 'chem', raw: rawToken, expr });
    }

    cursor = closeIdx + 2;
  }

  return tokens;
}

export function hasAnyChemToken(input: string): boolean {
  if (!input) return false;
  if (!input.includes('{{') && !input.includes('}}') && !input.includes('_') && !input.includes('^')) {
    return false;
  }
  return parseChemTokenList(input).some((t) => t.type === 'chem' || t.type === 'error');
}

export function extractPlainTextFromHtml(html: string): string {
  if (!html) return '';
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ');
  }
  const tpl = document.createElement('template');
  tpl.innerHTML = sanitizeRichHtml(html);
  return tpl.content.textContent ?? '';
}
