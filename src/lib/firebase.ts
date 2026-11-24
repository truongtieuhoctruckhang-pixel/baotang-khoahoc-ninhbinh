import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const ADMIN_EMAIL = 'truongtieuhoctruckhang@gmail.com';

const firebaseConfig = {
  apiKey: 'AIzaSyBEnBFFBh8MFZr6DEJ4qxcefxmgdP4fb6M',
  authDomain: 'duanstemhoa.firebaseapp.com',
  projectId: 'duanstemhoa',
  storageBucket: 'duanstemhoa.firebasestorage.app',
  messagingSenderId: '88317374838',
  appId: '1:88317374838:web:fd3a1e46273f7a1ab48a57',
  measurementId: 'G-NMR0GS27ES',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Bỏ qua nếu trình duyệt chặn lưu trữ cục bộ
  });
}

export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch {
          analytics = null;
        }
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  code?: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

export function formatFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : undefined;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    code: code || undefined,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
    },
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo = formatFirestoreError(error, operationType, path);
  const wrapped = new Error(JSON.stringify(errInfo)) as Error & { code?: string };
  if (errInfo.code) {
    wrapped.code = errInfo.code;
  }
  throw wrapped;
}
