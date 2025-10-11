import { HTTP_STATUS } from '../constants/httpStatus';
import { USERS } from '../constants/endpoints';
import {
  AlreadyExistError,
  TechnicalError,
  UnknownError,
  ValidationError,
  PermissionDeniedError,
} from 'logic-qcm-plus';
import { CreateUserPayload } from 'src/components/user/createUserPayload';
import { authService } from './auth/authService';

type CreateUserResponse = {
  isOk: boolean;
  message?: string;
};

export const createUser = async (
  userData: CreateUserPayload,
  currentUserRoleId: number
): Promise<CreateUserResponse | Error> => {
  const token = authService.getToken();
  const response = await fetch(USERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
     },
    body: JSON.stringify({
      ...userData,
      currentUserRoleId,
    }),
  });

  const result = await response.json();

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
