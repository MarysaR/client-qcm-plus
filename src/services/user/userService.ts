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

type CreateUserResponse = {
  isOk: boolean;
  message?: string;
};

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
    return Err.of(
      new PermissionDeniedError('Token d’authentification manquant')
    );
  }

  const result = await httpRequest(
    httpClient.get(USERS, {
      headers: { Authorization: 'Bearer ' + token },
    })
  );

  if (result.isErr()) {
    const error = result.error as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Erreur inconnue';

    switch (status) {
      case HTTP_STATUS.FORBIDDEN:
        return Err.of(new PermissionDeniedError(message));
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return Err.of(new TechnicalError(message));
      default:
        return Err.of(new UnknownError(message));
    }
  }

  const users = result.value.data;
  return Ok.of(users as User[]);
};
