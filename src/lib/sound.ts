let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new Ctor();
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playTone(freq: number, startOffsetSec: number, durationSec: number, gainPeak = 0.08) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + startOffsetSec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationSec + 0.02);
  } catch {
    // Ignore audio playback errors
  }
}

export function playQuizCorrectSound(): void {
  playTone(587.33, 0, 0.14, 0.07);
  playTone(880, 0.08, 0.22, 0.08);
}

export function playQuizWrongSound(): void {
  playTone(260, 0, 0.18, 0.06);
}

export function playStampUnlockedSound(): void {
  playTone(523.25, 0, 0.14, 0.07);
  playTone(659.25, 0.09, 0.16, 0.07);
  playTone(783.99, 0.18, 0.22, 0.08);
  playTone(1046.5, 0.28, 0.34, 0.09);
}
