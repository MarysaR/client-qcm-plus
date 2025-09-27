import {
  Result,
  Ok,
  Err,
  AppError,
  PermissionDeniedError,
  TechnicalError,
  User,
} from 'logic-qcm-plus';
import { LOGIN, LOGOUT, ME } from '../../constants/endpoints';
import { TOKEN_KEY } from '../../constants/storage';
import { httpRequest } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError, parseJsonSafe } from '../../utils/httpUtils';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async login(creds: {
    email: string;
    password: string;
  }): Promise<Result<void, AppError>> {
    const resResult = await httpRequest(LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });

    return mapHttpResult<void>(resResult, async (res) => {
      if (!res.ok) {
        const body = await parseJsonSafe<{ error?: string }>(res);
        const message = body?.error ?? "Échec de l'authentification";
        return Err.of(mapHttpError(res.status, message));
      }

      const body = await parseJsonSafe<{ token: string }>(res);
      if (!body || !body.token) {
        return Err.of(
          new TechnicalError('Réponse invalide du serveur (token manquant)')
        );
      }

      this.setToken(body.token);

      return Ok.of(undefined);
    });
  },

  async me(): Promise<Result<User, AppError>> {
    const token = this.getToken();
    if (!token) {
      return Err.of(new PermissionDeniedError('Aucun token présent'));
    }

    const resResult = await httpRequest(ME, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return mapHttpResult<User>(resResult, async (res) => {
      if (!res.ok) {
        const body = await parseJsonSafe<{ error?: string }>(res);
        const message =
          body?.error ?? "Impossible de récupérer l'utilisateur courant";
        return Err.of(mapHttpError(res.status, message));
      }

      const user = await parseJsonSafe<User>(res);
      if (!user) {
        return Err.of(
          new TechnicalError(
            'Réponse invalide du serveur (utilisateur manquant)'
          )
        );
      }

      return Ok.of(user);
    });
  },

  async logout(): Promise<Result<void, AppError>> {
    const token = this.getToken();
    this.clearToken();

    if (!token) {
      return Ok.of(undefined);
    }

    const resResult = await httpRequest(LOGOUT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    return mapHttpResult<void>(resResult, async (res) => {
      if (!res.ok) {
        const body = await parseJsonSafe<{ error?: string }>(res);
        const message = body?.error ?? 'Erreur lors de la déconnexion';
        return Err.of(mapHttpError(res.status, message));
      }
      return Ok.of(undefined);
    });
  },
};
