import {
  Ok,
  Err,
  PermissionDeniedError,
  TechnicalError,
  AlreadyExistError,
  Result,
  AppError,
  User,
} from 'logic-qcm-plus';
import { authService } from '../auth/authService';
import { HTTP_STATUS } from '../../constants/httpStatus';
import { CREATE_USERS, USERS } from '../../constants/endpoints';
import { CreateUserTypes } from 'src/types/createUserTypes';
import { httpRequest, httpClient } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError } from '../../utils/httpUtils';

export const userService = {
  async getAllUsers(): Promise<Result<User[], AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.get(USERS, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      const status = res.status;
      const body = res.data;

      const statusInvalide =
        status < HTTP_STATUS.OK ||
        (status >= HTTP_STATUS.BAD_REQUEST &&
          status < HTTP_STATUS.INTERNAL_SERVER_ERROR);
      if (statusInvalide) {
        return Err.of(mapHttpError(status));
      }

      if (!Array.isArray(body)) {
        return Err.of(
          new TechnicalError(
            'Réponse invalide du serveur (utilisateurs manquants)'
          )
        );
      }

      return Ok.of(body);
    });
  },

  async createUser(command: CreateUserTypes): Promise<Result<void, AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.post(CREATE_USERS, command, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      const status = res.status;
      if (status == HTTP_STATUS.CONFLICT) {
        return Err.of(new AlreadyExistError('Utilisateur déjà existant'));
      }

      if (status < HTTP_STATUS.OK || status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      return Ok.of(undefined);
    });
  },
};
