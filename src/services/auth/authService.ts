import {
  Result,
  Ok,
  Err,
  AppError,
  PermissionDeniedError,
  User,
} from 'logic-qcm-plus';
import { LOGIN, LOGOUT, ME } from '../../constants/endpoints';
import { TOKEN_KEY } from '../../constants/storage';
import { httpRequest, httpClient } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError } from '../../utils/httpUtils';
import { HTTP_STATUS } from '../../constants/httpStatus';

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
    const resResult = await httpRequest(httpClient.post(LOGIN, creds));

    return mapHttpResult<void>(resResult, async (res) => {
      const status = res.status;

      const data = res.data as { token?: string };
      if (status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      if (!data.token) {
        return Err.of(mapHttpError(HTTP_STATUS.INTERNAL_SERVER_ERROR));
      }

      this.setToken(data.token);
      return Ok.of(undefined);
    });
  },

  async me(): Promise<Result<User, AppError>> {
    const token = this.getToken();
    if (!token) {
      return Err.of(new PermissionDeniedError('Aucun token présent'));
    }

    const resResult = await httpRequest(
      httpClient.get(ME, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult<User>(resResult, async (res) => {
      const status = res.status;
      const data = res.data as User;

      if (status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      return Ok.of(data);
    });
  },

  async logout(): Promise<Result<void, AppError>> {
    const token = this.getToken();
    this.clearToken();

    if (!token) {
      return Ok.of(undefined);
    }

    const resResult = await httpRequest(httpClient.post(LOGOUT, { token }));

    return mapHttpResult<void>(resResult, async (res) => {
      const status = res.status;

      if (status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      return Ok.of(undefined);
    });
  },
};
