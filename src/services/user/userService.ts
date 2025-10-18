import { HTTP_STATUS } from '../../constants/httpStatus';
import { USERS } from '../../constants/endpoints';
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
  const response = await fetch(USERS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...userData,
    }),
  });

  const rawText = await response.text();
  const result = rawText.trim() !== '' ? JSON.parse(rawText) : {};

  switch (response.status) {
    case HTTP_STATUS.BAD_REQUEST:
      return new ValidationError(result.message || 'Données invalides.');
    case HTTP_STATUS.CONFLICT:
      return new AlreadyExistError(result.message || 'Email déjà utilisé.');
    case HTTP_STATUS.FORBIDDEN:
      return new PermissionDeniedError(result.message || 'Permission refusée.');
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return new TechnicalError(result.message || 'Erreur serveur.');
    default:
      if (!response.ok) {
        return new UnknownError(result.message || 'Erreur inconnue.');
      }
      return {
        isOk: true,
        message: result.message || 'Utilisateur créé avec succès.',
      };
  }
};


export const getAllUsers = async (): Promise<Result<User[], Error>> => {
  const token = authService.getToken();
  if (!token) {
    return Err.of(new PermissionDeniedError('Token d’authentification manquant'));
  }

  const response = await fetch(USERS, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    },
  })
      const rawText = await response.text();
      const result = rawText.trim() !== '' ? JSON.parse(rawText) : [];

      if (!response.ok) {
        switch (response.status) {
          case HTTP_STATUS.FORBIDDEN:
            return Err.of(new PermissionDeniedError(result.message || 'Accès refusé'));
          case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            return Err.of(new TechnicalError(result.message || 'Erreur serveur'));
          default:
            return Err.of(new UnknownError(result.message || 'Erreur inconnue'));
        }
      }

      return Ok.of(result as User[]);
};

