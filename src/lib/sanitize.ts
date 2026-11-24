import DOMPurify from 'dompurify';

let hooksConfigured = false;

function ensurePurifyHooks() {
  if (hooksConfigured || typeof window === 'undefined') return;
  hooksConfigured = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    const tag = node.tagName?.toLowerCase();

    if (tag === 'a') {
      const href = node.getAttribute('href') ?? '';
      if (!/^(https?:|mailto:|#)/i.test(href.trim())) {
        node.removeAttribute('href');
      } else {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }

    if (tag === 'img') {
      const src = (node.getAttribute('src') ?? '').trim();
      const allowedImg =
        /^https?:\/\//i.test(src) ||
        /^\/src\/assets\//i.test(src) ||
        /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(src);
      if (!allowedImg) {
        node.removeAttribute('src');
      }
    }

    if (tag === 'iframe') {
      const src = (node.getAttribute('src') ?? '').trim();
      const isAllowedYoutube =
        /^https:\/\/www\.youtube-nocookie\.com\/embed\/[a-zA-Z0-9_-]{11}(\?.*)?$/.test(src) ||
        /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(\?.*)?$/.test(src);
      if (!isAllowedYoutube) {
        node.parentNode?.removeChild(node);
      } else {
        node.setAttribute('loading', 'lazy');
        node.setAttribute('allowfullscreen', '');
        node.setAttribute(
          'allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        );
      }
    }
  });
}

export function sanitizeRichHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  ensurePurifyHooks();

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote',
      'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption', 'div', 'span', 'hr', 'iframe',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title',
      'class', 'style', 'colspan', 'rowspan',
      'allow', 'allowfullscreen', 'loading', 'frameborder',
    ],
    ALLOW_DATA_ATTR: false,
  });
}

export function sanitizePlainUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (
    /^https?:\/\//i.test(trimmed) ||
    /^\/src\/assets\//i.test(trimmed) ||
    /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)
  ) {
    return trimmed;
  }
  return '';
}
