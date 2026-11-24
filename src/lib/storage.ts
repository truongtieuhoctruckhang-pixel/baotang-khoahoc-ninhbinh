import { DANH_HIEU, STATIONS, type DanhHieu, type TramDiSan } from '../data';

const STORAGE_KEY = 'hcdl_khoahoc_40_progress_v1';

export interface StationProgressRecord {
  stationId: string;
  completed: boolean;
  bestScorePercent: number;
  correctCount: number;
  totalQuestions: number;
  pointsEarned: number;
  stampedAt: string;
}

export interface PassportProgress {
  completedStations: Record<string, StationProgressRecord>;
  totalPoints: number;
  lastVisitedStationId: string | null;
}

const DEFAULT_PROGRESS: PassportProgress = {
  completedStations: {},
  totalPoints: 0,
  lastVisitedStationId: null,
};

export function loadPassportProgress(): PassportProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<PassportProgress>;
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_PROGRESS };
    }
    const completedStations =
      parsed.completedStations && typeof parsed.completedStations === 'object'
        ? parsed.completedStations
        : {};
    const totalPoints = Object.values(completedStations).reduce(
      (sum, rec) => sum + (rec.completed ? rec.pointsEarned : 0),
      0
    );
    return {
      completedStations,
      totalPoints,
      lastVisitedStationId:
        typeof parsed.lastVisitedStationId === 'string' ? parsed.lastVisitedStationId : null,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function savePassportProgress(progress: PassportProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota or private browsing errors gracefully
  }
}

export function recordStationQuizResult(
  current: PassportProgress,
  stationId: string,
  correctCount: number,
  totalQuestions: number
): { updated: PassportProgress; passed: boolean; newlyStamped: boolean } {
  const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = percent >= 60;
  const existing = current.completedStations[stationId];
  const newlyStamped = passed && !existing?.completed;
  const pointsForAttempt = passed ? (percent === 100 ? 120 : 100) : 0;

  const nextCompleted = { ...current.completedStations };

  if (passed) {
    const bestPercent = Math.max(existing?.bestScorePercent ?? 0, percent);
    const bestPoints = Math.max(existing?.pointsEarned ?? 0, pointsForAttempt);
    nextCompleted[stationId] = {
      stationId,
      completed: true,
      bestScorePercent: bestPercent,
      correctCount: Math.max(existing?.correctCount ?? 0, correctCount),
      totalQuestions,
      pointsEarned: bestPoints,
      stampedAt: existing?.stampedAt ?? new Date().toISOString(),
    };
  }

  const totalPoints = Object.values(nextCompleted).reduce(
    (sum, rec) => sum + (rec.completed ? rec.pointsEarned : 0),
    0
  );

  const updated: PassportProgress = {
    completedStations: nextCompleted,
    totalPoints,
    lastVisitedStationId: stationId,
  };

  savePassportProgress(updated);
  return { updated, passed, newlyStamped };
}

export function resetPassportProgress(): PassportProgress {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return { ...DEFAULT_PROGRESS };
}

export function getCompletedCount(
  progress: PassportProgress,
  stations: TramDiSan[] = STATIONS
): number {
  return stations.filter((s) => progress.completedStations[s.id]?.completed).length;
}

export function getCurrentRank(completedCount: number): DanhHieu | null {
  const achieved = DANH_HIEU.filter((d) => completedCount >= d.mocTram);
  return achieved.length > 0 ? achieved[achieved.length - 1] : null;
}

export function getNextRank(completedCount: number): DanhHieu | null {
  return DANH_HIEU.find((d) => completedCount < d.mocTram) ?? null;
}

export function formatShortDateVi(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return 'Đã xác nhận';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return 'Đã xác nhận';
  }
}
