import {
  AppError,
  ValidationError,
  PermissionDeniedError,
  TechnicalError,
} from 'logic-qcm-plus';

import {
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_ERROR,
} from '../constants/httpStatus';

/**
 * Convertit un code HTTP en AppError typée.
 */
export function mapHttpError(status: number): AppError {
  if (status == HTTP_BAD_REQUEST) {
    return new ValidationError('Requête invalide');
  }

  if (status == HTTP_UNAUTHORIZED) {
    return new PermissionDeniedError('Authentification requise');
  }

  if (status == HTTP_FORBIDDEN) {
    return new PermissionDeniedError('Accès refusé');
  }

  if (status >= HTTP_INTERNAL_ERROR) {
    return new TechnicalError('Erreur interne du serveur');
  }

  return new TechnicalError('Erreur inconnue');
}
