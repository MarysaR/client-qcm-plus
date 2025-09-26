export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'MISSING_FIELDS'
  | 'AUTH_NOT_IMPLEMENTED'
  | 'INVALID_SESSION';

export interface LoginCredentials {
  email: string;
  password: string;
}
