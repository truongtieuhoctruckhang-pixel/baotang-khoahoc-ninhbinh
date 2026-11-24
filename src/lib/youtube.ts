const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Nhận diện và trích xuất YouTube Video ID (11 ký tự) từ mọi định dạng link hoặc ID thô.
 */
export function extractYoutubeId(input: string): {
  videoId: string;
  isValid: boolean;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { videoId: '', isValid: false };
  }

  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return { videoId: trimmed, isValid: true };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();

    if (host === 'youtu.be') {
      const seg = url.pathname.split('/').filter(Boolean)[0] ?? '';
      if (YOUTUBE_ID_REGEX.test(seg)) {
        return { videoId: seg, isValid: true };
      }
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const vParam = url.searchParams.get('v') ?? '';
      if (YOUTUBE_ID_REGEX.test(vParam)) {
        return { videoId: vParam, isValid: true };
      }

      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
        const candidate = parts[1];
        if (YOUTUBE_ID_REGEX.test(candidate)) {
          return { videoId: candidate, isValid: true };
        }
      }
    }
  } catch {
    // Fallback regex below
  }

  const fallbackMatch = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  if (fallbackMatch && fallbackMatch[1]) {
    return { videoId: fallbackMatch[1], isValid: true };
  }

  return { videoId: trimmed.slice(0, 32), isValid: false };
}

export function getYoutubeEmbedUrl(videoId: string, autoplay = false): string {
  const cleanId = encodeURIComponent(videoId.trim());
  return autoplay
    ? `https://www.youtube-nocookie.com/embed/${cleanId}?autoplay=1&mute=1&playsinline=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/${cleanId}?rel=0`;
}
