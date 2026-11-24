import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { ADMIN_EMAIL, auth } from '../lib/firebase';
import {
  AdminAuthCheckingCard,
  AdminDeniedCard,
  AdminSigningOutCard,
} from './AdminAccessStates';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  LOCKOUT_MS,
  MAX_FAILED_ATTEMPTS,
  clearLoginGuard,
  formatFriendlyError,
  readLoginGuard,
  writeLoginGuard,
} from './adminUtils';

interface AdminLoginViewProps {
  authReady: boolean;
  user: User | null;
  deniedEmail: string | null;
  onClearDenied: () => void;
  onResetLoginGuardState: () => void;
  onNavigate: (hash: string) => void;
}

export function AdminLoginView({
  authReady,
  user,
  deniedEmail,
  onClearDenied,
  onResetLoginGuardState,
  onNavigate,
}: AdminLoginViewProps) {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => readLoginGuard().failedAttempts);
  const [lockedUntil, setLockedUntil] = useState<number>(() => readLoginGuard().lockedUntil);
  const [lockSecondsLeft, setLockSecondsLeft] = useState<number>(() => {
    const until = readLoginGuard().lockedUntil;
    return until > Date.now() ? Math.ceil((until - Date.now()) / 1000) : 0;
  });

  useEffect(() => {
    if (lockedUntil <= Date.now()) {
      setLockSecondsLeft(0);
      return;
    }
    const updateCountdown = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockSecondsLeft(0);
        setLockedUntil(0);
        setFailedAttempts(0);
        clearLoginGuard();
      } else {
        setLockSecondsLeft(remaining);
      }
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 500);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const recordFailedLoginAttempt = (forceLock = false) => {
    const nextAttempts = failedAttempts + 1;
    if (forceLock || nextAttempts >= MAX_FAILED_ATTEMPTS) {
      const nextUntil = Date.now() + LOCKOUT_MS;
      setFailedAttempts(MAX_FAILED_ATTEMPTS);
      setLockedUntil(nextUntil);
      setLockSecondsLeft(Math.ceil(LOCKOUT_MS / 1000));
      writeLoginGuard({ failedAttempts: MAX_FAILED_ATTEMPTS, lockedUntil: nextUntil });
      return true;
    }
    setFailedAttempts(nextAttempts);
    writeLoginGuard({ failedAttempts: nextAttempts, lockedUntil: 0 });
    return false;
  };

  const handleEmailPasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (lockSecondsLeft > 0) return;

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setAuthFeedback({ type: 'error', text: 'Vui lòng nhập địa chỉ email quản trị.' });
      emailInputRef.current?.focus();
      return;
    }
    if (!passwordInput) {
      setAuthFeedback({ type: 'error', text: 'Vui lòng nhập mật khẩu.' });
      return;
    }

    onClearDenied();
    setAuthFeedback(null);
    setAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const signedEmail = cred.user.email ?? '';
      if (signedEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        recordFailedLoginAttempt(false);
        setPasswordInput('');
        await signOut(auth);
        return;
      }
      clearLoginGuard();
      setFailedAttempts(0);
      setLockedUntil(0);
      setLockSecondsLeft(0);
      setPasswordInput('');
      onResetLoginGuardState();
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code ?? '')
          : '';
      const isNetworkErr = code === 'auth/network-request-failed';
      const lockedNow = isNetworkErr
        ? false
        : recordFailedLoginAttempt(code === 'auth/too-many-requests');
      if (lockedNow) {
        setAuthFeedback({
          type: 'error',
          text: 'Bạn đã nhập sai quá 5 lần. Nút đăng nhập tạm khóa 60 giây để bảo vệ tài khoản.',
        });
      } else {
        setAuthFeedback({ type: 'error', text: formatFriendlyError(err) });
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setAuthFeedback({
        type: 'error',
        text: 'Vui lòng nhập địa chỉ email quản trị vào ô Email trước khi bấm "Quên mật khẩu?".',
      });
      emailInputRef.current?.focus();
      return;
    }
    setAuthFeedback(null);
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setAuthFeedback({
        type: 'success',
        text: `Nếu email ${cleanEmail} tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi tới hộp thư của bạn (kiểm tra cả mục Spam/Thư rác).`,
      });
    } catch (err) {
      setAuthFeedback({ type: 'error', text: formatFriendlyError(err) });
    } finally {
      setResetLoading(false);
    }
  };

  if (!authReady) {
    return <AdminAuthCheckingCard />;
  }

  if (!user && deniedEmail) {
    return (
      <AdminDeniedCard
        deniedEmail={deniedEmail}
        onRetryOtherAccount={() => {
          onClearDenied();
          setEmailInput('');
          setPasswordInput('');
          setAuthFeedback(null);
        }}
        onNavigateHome={() => onNavigate('#/')}
      />
    );
  }

  if (!user) {
    const isLocked = lockSecondsLeft > 0;
    return (
      <div className="mx-auto flex min-h-[85vh] max-w-md flex-col items-center justify-center px-4 py-12">
        <div className="passport-frame w-full rounded-[16px] bg-[#FBF8F1] p-7 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DCEFEA] text-[#0B3D3A]">
              <Database className="h-7 w-7" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6414]">
              Hệ thống quản trị nội dung (CMS)
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#17262B]">Đăng nhập Quản trị viên</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#4A5B60]">
              Nhập email và mật khẩu tài khoản quản trị để chỉnh sửa nội dung 12 trạm di sản, Tin tức và Trang giới thiệu.
            </p>
          </div>

          {isLocked && (
            <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-[12px] border border-[#C2553A]/50 bg-[#FBE9E3] p-3.5 text-xs font-medium leading-relaxed text-[#C2553A]">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Bạn đã nhập sai mật khẩu quá 5 lần. Hệ thống tạm khóa nút đăng nhập trong{' '}
                <strong className="tabular-nums">{lockSecondsLeft} giây</strong>.
              </span>
            </div>
          )}

          {authFeedback && !isLocked && (
            <div
              role="alert"
              className={`mt-5 flex items-start gap-2.5 rounded-[12px] border p-3.5 text-xs font-medium leading-relaxed ${
                authFeedback.type === 'error'
                  ? 'border-[#C2553A]/45 bg-[#FBE9E3] text-[#C2553A]'
                  : 'border-[#2E8B57]/45 bg-[#E4F4EA] text-[#2E8B57]'
              }`}
            >
              {authFeedback.type === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{authFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handleEmailPasswordLogin} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className={LABEL_CLASS}>Email quản trị</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5B60]" />
                <input ref={emailInputRef} id="admin-email" type="email" autoComplete="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Nhập email quản trị" className={`${INPUT_CLASS} pl-10`} />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-[#4A5B60]">Mật khẩu</label>
                <button type="button" disabled={resetLoading} onClick={handleForgotPassword} className="inline-flex items-center gap-1 text-xs font-semibold text-[#137A6F] transition-colors hover:text-[#0B3D3A] disabled:opacity-60">
                  <KeyRound className="h-3 w-3" />
                  <span>{resetLoading ? 'Đang gửi...' : 'Quên mật khẩu?'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5B60]" />
                <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Nhập mật khẩu" className={`${INPUT_CLASS} pl-10 pr-11`} />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[8px] text-[#4A5B60] transition-colors hover:bg-[#F3EDDD] hover:text-[#17262B]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {failedAttempts > 0 && failedAttempts < MAX_FAILED_ATTEMPTS && !isLocked && (
                <p className="mt-1.5 text-[11px] font-medium text-[#8A6414]">
                  Cảnh báo: Còn {MAX_FAILED_ATTEMPTS - failedAttempts} lần thử trước khi tạm khóa 60 giây.
                </p>
              )}
            </div>

            <button type="submit" disabled={authLoading || isLocked} className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-3 text-sm font-bold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.14)] transition-colors hover:bg-[#137A6F] disabled:cursor-not-allowed disabled:opacity-60">
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4 text-[#E2B857]" />}
              <span>{isLocked ? `Tạm khóa (${lockSecondsLeft}s)` : authLoading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
            </button>
          </form>

          <div className="mt-4 text-center">
            <button type="button" onClick={() => onNavigate('#/')} className="inline-flex min-h-[40px] items-center justify-center text-xs font-semibold text-[#137A6F] hover:text-[#0B3D3A]">
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminSigningOutCard />;
}
