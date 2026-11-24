import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import type katexType from 'katex';
import {
  extractPlainTextFromHtml,
  hasAnyChemToken,
  parseChemTokenList,
  preprocessChemExpression,
  unwrapWholeFormula,
} from './chemParser';
import { sanitizeRichHtml } from './sanitize';

export interface ChemSegment {
  type: 'text' | 'chem' | 'error';
  raw: string;
  expr?: string;
  html?: string;
  error?: string;
}

const KATEX_ALLOWED_TAGS = ['span', 'svg', 'path', 'line'];
const KATEX_ALLOWED_ATTR = [
  'class', 'aria-hidden', 'style', 'xmlns',
  'width', 'height', 'viewBox', 'preserveAspectRatio',
  'd', 'x1', 'y1', 'x2', 'y2', 'fill', 'stroke', 'stroke-width',
];

let loadedKatex: typeof katexType | null = null;
let katexLoadPromise: Promise<typeof katexType> | null = null;

export function ensureKatexLoaded(): Promise<typeof katexType> {
  if (loadedKatex) return Promise.resolve(loadedKatex);
  if (!katexLoadPromise) {
    katexLoadPromise = Promise.all([
      import('katex/dist/katex.min.css'),
      import('katex'),
      import('katex/contrib/mhchem'),
    ]).then(([, katexMod]) => {
      loadedKatex = katexMod.default;
      return loadedKatex;
    });
  }
  return katexLoadPromise;
}

export function useKatexReady(needsKatex: boolean): boolean {
  const [ready, setReady] = useState<boolean>(() => Boolean(loadedKatex));

  useEffect(() => {
    if (!needsKatex || loadedKatex) {
      if (loadedKatex && !ready) setReady(true);
      return;
    }
    let active = true;
    void ensureKatexLoaded().then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [needsKatex, ready]);

  return ready;
}

export function renderChemFormulaHtml(rawExpr: string): {
  html: string | null;
  error: string | null;
} {
  const expr = rawExpr.trim();
  if (!expr) {
    return { html: null, error: 'Công thức trống bên trong {{ }}' };
  }
  if (!loadedKatex) {
    return { html: null, error: null };
  }

  const latex = preprocessChemExpression(expr);
  try {
    const katexHtml = loadedKatex.renderToString(latex, {
      throwOnError: true,
      strict: 'ignore',
      trust: false,
      output: 'html',
    });

    const cleanHtml =
      typeof window !== 'undefined'
        ? DOMPurify.sanitize(katexHtml, {
            ALLOWED_TAGS: KATEX_ALLOWED_TAGS,
            ALLOWED_ATTR: KATEX_ALLOWED_ATTR,
            ALLOW_DATA_ATTR: false,
          })
        : katexHtml;

    return { html: cleanHtml, error: null };
  } catch (err) {
    return {
      html: null,
      error: err instanceof Error ? err.message : 'Công thức sai cú pháp',
    };
  }
}

export function parseChemSegments(input: string): ChemSegment[] {
  const tokens = parseChemTokenList(input);
  return tokens.map((tok) => {
    if (tok.type !== 'chem' || !tok.expr) {
      return tok;
    }
    const { html, error } = renderChemFormulaHtml(tok.expr);
    if (html) {
      return { type: 'chem', raw: tok.raw, expr: tok.expr, html };
    }
    if (error) {
      return { type: 'error', raw: tok.raw, expr: tok.expr, error };
    }
    return { type: 'text', raw: unwrapWholeFormula(tok.raw) };
  });
}

export function hasChemSyntaxError(
  input: string,
  formulaMode = false
): { hasError: boolean; firstError: string | null } {
  if (!loadedKatex) {
    const quickErr = !formulaMode
      ? parseChemTokenList(input).find((t) => t.type === 'error')
      : undefined;
    return { hasError: Boolean(quickErr), firstError: quickErr?.error ?? null };
  }
  if (formulaMode) {
    if (!input.trim()) return { hasError: false, firstError: null };
    const { error } = renderChemFormulaHtml(input);
    return { hasError: Boolean(error), firstError: error };
  }
  if (!input || (!input.includes('{{') && !input.includes('}}'))) {
    return { hasError: false, firstError: null };
  }
  const firstErr = parseChemSegments(input).find((s) => s.type === 'error');
  return { hasError: Boolean(firstErr), firstError: firstErr?.error ?? null };
}

export function renderRichHtmlWithChem(dirtyHtml: string): string {
  const cleanHtml = sanitizeRichHtml(dirtyHtml);
  if (
    !cleanHtml ||
    !loadedKatex ||
    (!cleanHtml.includes('{{') && !cleanHtml.includes('_') && !cleanHtml.includes('^'))
  ) {
    return cleanHtml;
  }
  if (typeof document === 'undefined') return cleanHtml;

  const tpl = document.createElement('template');
  tpl.innerHTML = cleanHtml;

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const parentTag = current.parentElement?.tagName?.toLowerCase() ?? '';
    const txt = current.nodeValue ?? '';
    if (
      parentTag !== 'script' &&
      parentTag !== 'style' &&
      parentTag !== 'code' &&
      parentTag !== 'pre' &&
      (txt.includes('{{') || txt.includes('_') || txt.includes('^'))
    ) {
      textNodes.push(current as Text);
    }
    current = walker.nextNode();
  }

  for (const node of textNodes) {
    const segments = parseChemSegments(node.nodeValue ?? '');
    if (!segments.some((s) => s.type === 'chem' && s.html)) continue;

    const frag = document.createDocumentFragment();
    for (const seg of segments) {
      if (seg.type === 'chem' && seg.html) {
        const wrapper = document.createElement('span');
        wrapper.className = 'chem-inline-scroll';
        wrapper.innerHTML = seg.html;
        frag.appendChild(wrapper);
      } else {
        frag.appendChild(document.createTextNode(seg.raw));
      }
    }
    node.parentNode?.replaceChild(frag, node);
  }

  return tpl.innerHTML;
}

export function ChemText({ text, className }: { text: string; className?: string }) {
  const needsKatex = useMemo(() => hasAnyChemToken(text), [text]);
  const katexReady = useKatexReady(needsKatex);

  const segments = useMemo(
    () => (needsKatex && katexReady ? parseChemSegments(text) : null),
    [text, needsKatex, katexReady]
  );

  if (!text) return null;
  if (!needsKatex || !segments) {
    return <span className={className}>{unwrapWholeFormula(text)}</span>;
  }

  return (
    <span className={className}>
      {segments.map((seg, idx) =>
        seg.type === 'chem' && seg.html ? (
          <span
            key={idx}
            className="chem-inline-scroll"
            dangerouslySetInnerHTML={{ __html: seg.html }}
          />
        ) : (
          <span key={idx}>{seg.raw}</span>
        )
      )}
    </span>
  );
}

export function RichHtmlWithChem({
  html,
  className = 'cms-prose',
}: {
  html: string;
  className?: string;
}) {
  const needsKatex = useMemo(
    () => hasAnyChemToken(extractPlainTextFromHtml(html)),
    [html]
  );
  const katexReady = useKatexReady(needsKatex);

  const renderedHtml = useMemo(
    () => (needsKatex && katexReady ? renderRichHtmlWithChem(html) : sanitizeRichHtml(html)),
    [html, needsKatex, katexReady]
  );

  return <div className={className} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
}
