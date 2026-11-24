import confetti from 'canvas-confetti';

const PALETTE_COLORS = ['#0B3D3A', '#137A6F', '#C9962E', '#E2B857', '#FBF8F1'];

export function startConfettiSequence(
  canvas: HTMLCanvasElement,
  grandFinale: boolean,
  onComplete?: () => void
): () => void {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    onComplete?.();
    return () => {};
  }

  const fire = confetti.create(canvas, { resize: true, useWorker: false });
  const duration = grandFinale ? 6000 : 3000;
  const endTime = performance.now() + duration;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  let rafId = 0;
  let finishTimerId = 0;
  let lastBurstAt = performance.now();
  let cancelled = false;

  const sideCount = grandFinale ? (isMobile ? 28 : 42) : isMobile ? 18 : 26;
  const centerCount = grandFinale ? (isMobile ? 36 : 54) : isMobile ? 22 : 34;

  const launchTripleBurst = (sideParticles: number, centerParticles: number, opening: boolean) => {
    const spread = opening ? (grandFinale ? 68 : 55) : grandFinale ? 60 : 48;
    const velocity = opening ? (grandFinale ? 62 : 50) : grandFinale ? 55 : 44;
    const scalar = opening ? (grandFinale ? 1.15 : 1) : grandFinale ? 1.1 : 0.95;
    const ticks = opening ? (grandFinale ? 260 : 190) : 200;

    fire({
      particleCount: sideParticles,
      angle: 62,
      spread,
      startVelocity: velocity,
      origin: { x: 0, y: 1 },
      colors: PALETTE_COLORS,
      scalar,
      ticks,
      disableForReducedMotion: true,
    });
    fire({
      particleCount: sideParticles,
      angle: 118,
      spread,
      startVelocity: velocity,
      origin: { x: 1, y: 1 },
      colors: PALETTE_COLORS,
      scalar,
      ticks,
      disableForReducedMotion: true,
    });
    fire({
      particleCount: centerParticles,
      angle: 90,
      spread: opening ? (grandFinale ? 85 : 65) : grandFinale ? 72 : 55,
      startVelocity: opening ? (grandFinale ? 58 : 46) : grandFinale ? 50 : 40,
      origin: { x: 0.5, y: 0.96 },
      colors: PALETTE_COLORS,
      scalar,
      ticks,
      disableForReducedMotion: true,
    });
  };

  launchTripleBurst(sideCount, centerCount, true);

  const intervalMs = grandFinale ? 260 : 320;

  const frame = (now: number) => {
    if (cancelled) return;
    if (now < endTime) {
      if (now - lastBurstAt >= intervalMs) {
        lastBurstAt = now;
        const burstSide = grandFinale ? (isMobile ? 10 : 16) : isMobile ? 6 : 10;
        const burstCenter = grandFinale ? (isMobile ? 12 : 18) : isMobile ? 7 : 11;
        launchTripleBurst(burstSide, burstCenter, false);
      }
      rafId = requestAnimationFrame(frame);
    } else {
      finishTimerId = window.setTimeout(() => {
        if (!cancelled) onComplete?.();
      }, 1200);
    }
  };

  rafId = requestAnimationFrame(frame);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(finishTimerId);
    fire.reset();
  };
}
