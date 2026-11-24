import { useEffect, useRef } from 'react';
import { startConfettiSequence } from '../lib/confetti';

interface ConfettiBurstProps {
  active: boolean;
  grandFinale?: boolean;
  onComplete?: () => void;
}

export function ConfettiBurst({
  active,
  grandFinale = false,
  onComplete,
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startConfettiSequence(canvas, grandFinale, () => {
      onCompleteRef.current?.();
    });
  }, [active, grandFinale]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
}
