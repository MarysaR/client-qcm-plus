import { AuthUser, LoginCredentials } from '../../../types/auth';
const STORAGE_KEY = 'mock_auth_user';

// Jeu d'utilisateurs mock
const MOCK_USERS: Array<{ username: string; password: string; role?: string }> =
  [
    { username: 'admin', password: 'REMOVED', role: 'ADMIN' },
    { username: 'user', password: 'REMOVED', role: 'USER' },
  ];

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function loginMock(creds: LoginCredentials): Promise<AuthUser> {
  await delay(600); // petite latence simulée
  const found = MOCK_USERS.find(
    (u) =>
      u.username.toLowerCase() === creds.username.toLowerCase() &&
      u.password === creds.password
  );
  if (!found) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const user: AuthUser = {
    id: crypto.randomUUID(),
    username: found.username,
    role: found.role,
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
