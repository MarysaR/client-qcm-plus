// src/utils/httpUtils.ts
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
 * Tente de parser une réponse HTTP en JSON.
 * Retourne `null` si le parsing échoue.
 */
export async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  return res.json().then(
    (data) => data as T,
    () => null
  );
}

/**
 * Convertit un code HTTP en AppError typée (erreurs centralisées).
 */
export function mapHttpError(status: number, fallback: string): AppError {
  if (status == HTTP_BAD_REQUEST) {
    return new ValidationError(fallback);
  }
  if (status == HTTP_UNAUTHORIZED || status == HTTP_FORBIDDEN) {
    return new PermissionDeniedError(fallback);
  }
  if (status >= HTTP_INTERNAL_ERROR) {
    return new TechnicalError('Erreur serveur');
  }
  return new ValidationError(fallback);
}
