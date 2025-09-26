import { AuthErrorCode, AuthUser, LoginCredentials } from '../../../types/auth';
import { Result, Ok, Err } from 'logic-qcm-plus';

const STORAGE_KEY = 'mock_auth_user';
const MODE = import.meta.env.VITE_AUTH_MODE;

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function toStableId(input: string): string {
  // ID stable dérivé du username (aucun secret)
  return 'mock-' + input.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

export async function loginMock(
  creds: LoginCredentials
): Promise<Result<AuthUser, AuthError>> {
  if (MODE && MODE !== 'mock') {
    return Err.of<AuthUser, AuthError>(
      new AuthError('AUTH_NOT_IMPLEMENTED', 'Mode non implémenté')
    );
  }

  await delay(300);

  if (!creds.email?.trim() || !creds.password?.trim()) {
    return Err.of<AuthUser, AuthError>(
      new AuthError(
        'MISSING_FIELDS',
        'Nom d’utilisateur et mot de passe requis'
      )
    );
  }

  const role = creds.email.toLowerCase().includes('admin')
    ? 'ADMIN'
    : 'STAGIAIRE';

  const user: AuthUser = {
    id: toStableId(creds.email),
    email: creds.email,
    role,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return Ok.of<AuthUser, AuthError>(user);
}

export function loadSession(): Result<AuthUser, AuthError> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return Err.of<AuthUser, AuthError>(
      new AuthError('INVALID_SESSION', 'Aucune session trouvée')
    );
  }
  try {
    const user = JSON.parse(raw) as AuthUser;
    return Ok.of<AuthUser, AuthError>(user);
  } catch {
    return Err.of<AuthUser, AuthError>(
      new AuthError('INVALID_SESSION', 'Session invalide')
    );
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export { loginMock as _loginMockInternal };
