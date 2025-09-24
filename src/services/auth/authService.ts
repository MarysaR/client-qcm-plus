import { AuthUser, LoginCredentials } from '../../../types/auth';

const STORAGE_KEY = 'mock_auth_user';
const MODE = import.meta.env.VITE_AUTH_MODE; // 'mock'

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function toStableId(input: string): string {
  // ID stable dérivé du username (aucun secret)
  return 'mock-' + input.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

export async function loginMock(creds: LoginCredentials): Promise<AuthUser> {
  if (MODE !== 'mock') {
    // Mode réel pas encore implémenté
    throw new Error('AUTH_NOT_IMPLEMENTED');
  }

  await delay(300);

  if (!creds.username?.trim() || !creds.password?.trim()) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const role = creds.username.toLowerCase().includes('admin')
    ? 'ADMIN'
    : 'USER';

  const user: AuthUser = {
    id: toStableId(creds.username),
    username: creds.username,
    role,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function loadSession(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export { loginMock as _loginMockInternal };
