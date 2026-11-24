import { useState } from 'react';
import { Compass } from 'lucide-react';

interface StationImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackLabel?: string;
}

export function StationImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackLabel,
}: StationImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#DCEFEA] via-[#FBF8F1] to-[#F6EBCB] text-[#17262B] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 30%, rgba(19,122,111,0.22), transparent 55%), radial-gradient(circle at 75% 75%, rgba(201,150,46,0.22), transparent 55%)',
          }}
        />
        <Compass className="relative h-8 w-8 text-[#137A6F]" strokeWidth={1.6} />
        {fallbackLabel && (
          <span className="relative mt-2 px-3 text-center text-xs font-medium text-[#4A5B60] line-clamp-2">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
