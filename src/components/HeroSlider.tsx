import { useEffect, useState, useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '../data';

interface HeroSliderProps {
  slides: HeroSlide[];
  children: ReactNode;
}

export function HeroSlider({ slides, children }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);

  const activeSlides = slides.length > 0 ? slides : [{ url: '', nhan: '' }];
  const hasMultiple = activeSlides.length > 1;

  // Check desktop view (>= 768px) and prefers-reduced-motion
  useEffect(() => {
    const mediaDesktop = window.matchMedia('(min-width: 768px)');
    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMedia = () => {
      setIsDesktop(mediaDesktop.matches);
      setReducedMotion(mediaMotion.matches);
    };

    updateMedia();
    mediaDesktop.addEventListener('change', updateMedia);
    mediaMotion.addEventListener('change', updateMedia);

    return () => {
      mediaDesktop.removeEventListener('change', updateMedia);
      mediaMotion.removeEventListener('change', updateMedia);
    };
  }, []);

  // Preload subsequent images once component mounts on desktop
  useEffect(() => {
    if (!isDesktop || activeSlides.length <= 1) return;
    const timer = window.setTimeout(() => {
      activeSlides.forEach((slide, idx) => {
        if (idx === 0) return;
        const img = new Image();
        img.src = slide.url;
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [isDesktop, activeSlides]);

  // Visibility change handling (pause when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsHidden(document.hidden);
    };
    setIsHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Reset/start timer helper function
  const resetTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!isDesktop || !hasMultiple || isHidden) return;

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
  };

  // Auto-advance timer setup & cleanup
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isDesktop, hasMultiple, isHidden, activeSlides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    resetTimer();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    resetTimer();
  };

  return (
    <section className="group relative overflow-hidden bg-gradient-to-br from-[#0B3D3A] to-[#115E56] text-[#FBF8F1]">
      <div className="relative min-h-[430px] sm:min-h-[500px] lg:min-h-[540px]">
        {/* Background Images / Slider */}
        {isDesktop && hasMultiple ? (
          activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity ease-in-out ${
                  isActive ? 'opacity-55 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                style={{ transitionDuration: '1200ms' }}
              >
                <img
                  src={slide.url}
                  alt={slide.nhan}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 h-full w-full object-cover mix-blend-luminosity ${
                    isActive && !reducedMotion ? 'animate-hero-zoom' : ''
                  }`}
                />
              </div>
            );
          })
        ) : (
          /* Mobile (< 768px) or single image: static first slide only */
          <div className="absolute inset-0 opacity-55 z-10">
            <img
              src={activeSlides[0]?.url}
              alt={activeSlides[0]?.nhan || 'Hero'}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity"
            />
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#0B3D3A] via-[#0B3D3A]/80 to-[#115E56]/60"
          aria-hidden="true"
        />
        <div
          className="heritage-pattern-overlay pointer-events-none absolute inset-0 z-20"
          aria-hidden="true"
        />

        {/* Fixed Content Overlay */}
        <div className="relative z-30 mx-auto flex min-h-[430px] max-w-6xl flex-col justify-end px-4 py-10 sm:min-h-[500px] sm:px-6 sm:py-14 lg:min-h-[540px]">
          {children}
        </div>

        {/* Desktop Controls: Left/Right Arrows on Hover */}
        {isDesktop && hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 z-40 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B3D3A]/60 text-[#FBF8F1] border border-[#E2B857]/40 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#0B3D3A] hover:scale-105 shadow-md focus-visible:opacity-100"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-6 w-6 text-[#E2B857]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 z-40 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B3D3A]/60 text-[#FBF8F1] border border-[#E2B857]/40 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#0B3D3A] hover:scale-105 shadow-md focus-visible:opacity-100"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="h-6 w-6 text-[#E2B857]" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
