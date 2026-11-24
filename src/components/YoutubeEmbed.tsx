import { useEffect, useRef, useState } from 'react';
import { PlayCircle, VolumeX } from 'lucide-react';
import { ChemText } from '../lib/chem';
import { extractYoutubeId, getYoutubeEmbedUrl } from '../lib/youtube';

interface YoutubeEmbedProps {
  stationId: string;
  youtubeInput: string;
  title: string;
  duration: string;
  autoplay?: boolean;
}

export function YoutubeEmbed({
  stationId,
  youtubeInput,
  title,
  duration,
  autoplay = false,
}: YoutubeEmbedProps) {
  const [videoInView, setVideoInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const parsedVideo = extractYoutubeId(youtubeInput);
  const resolvedVideoId = parsedVideo.isValid ? parsedVideo.videoId : youtubeInput.trim();
  const isAutoplay = Boolean(autoplay);

  useEffect(() => {
    setVideoInView(false);
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVideoInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) {
          setVideoInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stationId, resolvedVideoId, isAutoplay]);

  return (
    <section aria-labelledby="video-heading" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#137A6F]">
          <PlayCircle className="h-4 w-4" />
          <h2 id="video-heading">Tư liệu video thực tế</h2>
        </div>
        <span className="text-xs font-medium text-[#4A5B60] tabular-nums">
          Thời lượng: {duration}
        </span>
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD] p-2 shadow-[0_8px_24px_rgba(11,61,58,0.10)] sm:p-3"
      >
        {isAutoplay && videoInView && (
          <div className="mb-2 flex items-center gap-1.5 px-1 text-xs font-medium text-[#8A6414]">
            <VolumeX className="h-3.5 w-3.5 shrink-0 text-[#C9962E]" />
            <span>Chạm vào video để bật tiếng</span>
          </div>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-[#0B3D3A]">
          {videoInView ? (
            <iframe
              key={`${resolvedVideoId}-${isAutoplay ? 'autoplay' : 'manual'}`}
              src={getYoutubeEmbedUrl(resolvedVideoId, isAutoplay)}
              title={title}
              loading={isAutoplay ? 'eager' : 'lazy'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-[#DCEFEA]">
              <PlayCircle className="h-10 w-10 text-[#E2B857]/90" />
              <span className="text-xs font-medium">
                Cuộn xuống khung video để tải và phát tư liệu
              </span>
            </div>
          )}
        </div>
        <div className="px-2 pb-1 pt-3 text-sm font-semibold text-[#17262B]">
          <ChemText text={title} />
        </div>
      </div>
    </section>
  );
}
