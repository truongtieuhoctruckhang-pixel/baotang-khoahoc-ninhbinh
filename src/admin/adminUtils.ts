import type { CumTram, ProjectInfo, TramDiSan } from '../data';

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const INPUT_CLASS =
  'w-full rounded-[12px] border border-[#E3DAC3] bg-[#FBF8F1] px-3.5 py-2.5 text-sm text-[#17262B] placeholder:text-[#4A5B60]/60 focus:border-[#137A6F] focus:outline-none focus:ring-2 focus:ring-[#137A6F]/20';

export const LABEL_CLASS =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4A5B60]';

const STATION_DRAFT_PREFIX = 'cms_station_draft_';
const HOME_DRAFT_KEY = 'cms_home_draft_v1';
const LOGIN_GUARD_KEY = 'cms_admin_login_guard_v1';

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MS = 60_000;

export interface LoginGuardState {
  failedAttempts: number;
  lockedUntil: number;
}

export function readLocalStationDraft(stationId: string): TramDiSan | null {
  try {
    const raw = localStorage.getItem(`${STATION_DRAFT_PREFIX}${stationId}`);
    if (!raw) return null;
    return JSON.parse(raw) as TramDiSan;
  } catch {
    return null;
  }
}

export function writeLocalStationDraft(station: TramDiSan): void {
  try {
    localStorage.setItem(`${STATION_DRAFT_PREFIX}${station.id}`, JSON.stringify(station));
  } catch {
    // ignore storage quota errors
  }
}

export function clearLocalStationDraft(stationId: string): void {
  try {
    localStorage.removeItem(`${STATION_DRAFT_PREFIX}${stationId}`);
  } catch {
    // ignore
  }
}

export function readLocalHomeDraft(): { projectInfo: ProjectInfo; clusters: CumTram[] } | null {
  try {
    const raw = localStorage.getItem(HOME_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { projectInfo: ProjectInfo; clusters: CumTram[] };
  } catch {
    return null;
  }
}

export function writeLocalHomeDraft(projectInfo: ProjectInfo, clusters: CumTram[]): void {
  try {
    localStorage.setItem(HOME_DRAFT_KEY, JSON.stringify({ projectInfo, clusters }));
  } catch {
    // ignore
  }
}

export function clearLocalHomeDraft(): void {
  try {
    localStorage.removeItem(HOME_DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function readLoginGuard(): LoginGuardState {
  try {
    const raw = localStorage.getItem(LOGIN_GUARD_KEY);
    if (!raw) return { failedAttempts: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw) as Partial<LoginGuardState>;
    const failedAttempts =
      typeof parsed.failedAttempts === 'number' && parsed.failedAttempts >= 0
        ? parsed.failedAttempts
        : 0;
    const lockedUntil =
      typeof parsed.lockedUntil === 'number' && parsed.lockedUntil > 0
        ? parsed.lockedUntil
        : 0;
    if (lockedUntil > 0 && lockedUntil <= Date.now()) {
      localStorage.removeItem(LOGIN_GUARD_KEY);
      return { failedAttempts: 0, lockedUntil: 0 };
    }
    return { failedAttempts, lockedUntil };
  } catch {
    return { failedAttempts: 0, lockedUntil: 0 };
  }
}

export function writeLoginGuard(state: LoginGuardState): void {
  try {
    localStorage.setItem(LOGIN_GUARD_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function clearLoginGuard(): void {
  try {
    localStorage.removeItem(LOGIN_GUARD_KEY);
  } catch {
    // ignore
  }
}

export function extractFirebaseErrorCode(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const direct = String((err as { code?: unknown }).code ?? '').trim();
    if (direct) return direct;
  }
  if (err instanceof Error && err.message) {
    try {
      const parsed = JSON.parse(err.message) as { code?: unknown };
      if (parsed && typeof parsed.code === 'string' && parsed.code.trim()) {
        return parsed.code.trim();
      }
    } catch {
      // ignore non-JSON messages
    }
  }
  return '';
}

export function formatFriendlyError(err: unknown): string {
  const code = extractFirebaseErrorCode(err);
  const msg = err instanceof Error ? err.message : String(err);
  const combined = `${code} ${msg}`;
  const codeTag = code ? ` (Mã lỗi Firebase: ${code})` : '';

  if (
    combined.includes('auth/invalid-credential') ||
    combined.includes('auth/wrong-password') ||
    combined.includes('auth/user-not-found')
  ) {
    return `Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại.${codeTag}`;
  }
  if (combined.includes('auth/invalid-email')) {
    return `Địa chỉ email không đúng định dạng.${codeTag}`;
  }
  if (combined.includes('auth/too-many-requests')) {
    return `Quá nhiều lần thử đăng nhập không thành công. Vui lòng đợi một lát rồi thử lại.${codeTag}`;
  }
  if (combined.includes('auth/network-request-failed')) {
    return `Mất kết nối mạng. Vui lòng kiểm tra kết nối Internet và thử lại.${codeTag}`;
  }
  if (combined.includes('auth/user-disabled')) {
    return `Tài khoản này đã bị vô hiệu hóa trong hệ thống.${codeTag}`;
  }
  if (combined.includes('Quota exceeded') || combined.includes('resource-exhausted')) {
    return `Hệ thống cơ sở dữ liệu tạm thời hết hạn mức miễn phí trong ngày. Vui lòng thử lại vào ngày mai.${codeTag}`;
  }
  if (
    code === 'permission-denied' ||
    combined.includes('insufficient permissions') ||
    combined.includes('PERMISSION_DENIED')
  ) {
    const effectiveCode = code || 'permission-denied';
    return `Tài khoản hiện tại không có quyền ghi dữ liệu lên Firebase. Vui lòng kiểm tra User UID trong Firestore Rules. (Mã lỗi Firebase: ${effectiveCode})`;
  }
  if (code) {
    return `Lỗi lưu dữ liệu Firebase (${code}): ${msg || 'Vui lòng thử lại.'}`;
  }
  return msg || 'Đã xảy ra lỗi khi xử lý dữ liệu.';
}

export function createSlugFromTitle(title: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return base ? `${base}-${Date.now().toString().slice(-4)}` : `tin-${Date.now()}`;
}
