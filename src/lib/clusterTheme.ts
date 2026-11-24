import type { CumTram, TramDiSan } from '../data';

export function hexToSoftBg(hex: string): string {
  const clean = hex.replace('#', '').trim();
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.11)`;
  }
  return 'rgba(19, 122, 111, 0.11)';
}

const DEFAULT_CLUSTER_COLORS: Record<
  TramDiSan['cumId'],
  { color: string; pillBg: string; textOnLight: string }
> = {
  'cum-1': {
    color: '#137A6F',
    pillBg: 'rgba(19, 122, 111, 0.11)',
    textOnLight: '#137A6F',
  },
  'cum-2': {
    color: '#B07A1C',
    pillBg: 'rgba(176, 122, 28, 0.12)',
    textOnLight: '#8A6414',
  },
  'cum-3': {
    color: '#1F6F8B',
    pillBg: 'rgba(31, 111, 139, 0.11)',
    textOnLight: '#1F6F8B',
  },
};

export function getClusterAccent(
  cumId: TramDiSan['cumId'],
  clusters: CumTram[]
): { color: string; pillBg: string; textOnLight: string } {
  const fallback = DEFAULT_CLUSTER_COLORS[cumId];
  const matched = clusters.find((c) => c.id === cumId);
  if (!matched?.mauDau) return fallback;

  return {
    color: matched.mauDau,
    pillBg: hexToSoftBg(matched.mauDau),
    textOnLight:
      cumId === 'cum-2' && matched.mauDau.toUpperCase() === '#B07A1C'
        ? '#8A6414'
        : matched.mauDau,
  };
}
