import { HTTP_STATUS } from '../../constants/httpStatus';
import { CREATE_USERS, USERS } from '../../constants/endpoints';
import {
  AlreadyExistError,
  TechnicalError,
  UnknownError,
  ValidationError,
  PermissionDeniedError,
  User,
  Result,
  Err,
  Ok,
} from 'logic-qcm-plus';
import { CreateUserTypes } from 'src/types/createUserTypes';
import { authService } from '../auth/authService';
import { httpClient, httpRequest } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError } from '../../utils/httpUtils';

type CreateUserResponse = {
  isOk: boolean;
  message?: string;
};

const BASE_URL = '/users';

export const createUser = async (
  userData: CreateUserTypes
): Promise<CreateUserResponse | Error> => {
  const token = authService.getToken();
  if (!token) {
    return {
      isOk: false,
      message: 'Utilisateur non authentifié (token manquant)',
    };
  }

  const result = await httpRequest(
    httpClient.post(CREATE_USERS, userData, {
      headers: { Authorization: 'Bearer ' + token },
    })
  );

  if (result.isErr()) {
    const error = result.error;
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Erreur inconnue';

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return new ValidationError(message);
      case HTTP_STATUS.CONFLICT:
        return new AlreadyExistError(message);
      case HTTP_STATUS.FORBIDDEN:
        return new PermissionDeniedError(message);
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return new TechnicalError(message);
      default:
        return new UnknownError(message);
    }
  }

  const responseData = result.value.data;
  return {
    isOk: true,
    message: responseData.message || 'Utilisateur créé avec succès.',
  };
};

export const getAllUsers = async (): Promise<Result<User[], Error>> => {
  const token = authService.getToken();
  if (!token) {
    return Err.of(new PermissionDeniedError(
      'Utilisateur non authentifié (token manquant)'));
  }

  const resResult = await httpRequest(
    httpClient.get(BASE_URL, 
      {headers: { Authorization: 'Bearer ' + token },
    })
  );

  return mapHttpResult(resResult, async (res) => {
    let status;
    if ('status' in res) {
      status = res.status;
    } else {
      status = (res as Response).status;
    }

    let body = {};
    if ('data' in res) {
      body = res.data;
    } else {
      const json = await (res as Response).json();
      if (typeof json === 'object' && json !== null) {
        body = json;
      }
    }

    const statusInvalide =
      status < HTTP_STATUS.OK ||
      (status >= HTTP_STATUS.BAD_REQUEST && 
        status < HTTP_STATUS.INTERNAL_SERVER_ERROR);

    if (statusInvalide) {
      return Err.of(mapHttpError(status));
    }

    if (!Array.isArray(body)) {
      return Err.of(new TechnicalError(
        'Réponse invalide du serveur (utilisateurs manquants)'));
    }

    return Ok.of(body);
  });
};

