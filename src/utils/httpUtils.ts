import {
  Result,
  Ok,
  Err,
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

export function getHttpStatus(res: unknown): number {
  if (
    res &&
    typeof res == 'object' &&
    'status' in (res as Record<string, unknown>)
  ) {
    return (res as { status: number }).status;
  }

  const response = res as Response;
  return response.status;
}

export async function parseJsonSafe<T>(
  res: Response
): Promise<Result<T | null, AppError>> {
  const text = await res.text();

  if (text == '' || text == undefined || text == null) {
    return Ok.of(null);
  }

  const data = JSON.parse(text);
  if (typeof data == 'object' && data !== null) {
    return Ok.of(data as T);
  }

  return Err.of(new TechnicalError('Format JSON invalide'));
}

/**
 * Convertit un code HTTP en AppError typée.
 */
export function mapHttpError(status: number): AppError {
  if (status === HTTP_BAD_REQUEST) {
    return new ValidationError('Requête invalide');
  }

  if (status === HTTP_UNAUTHORIZED) {
    return new PermissionDeniedError('Authentification requise');
  }

  if (status === HTTP_FORBIDDEN) {
    return new PermissionDeniedError('Accès refusé');
  }

  if (status >= HTTP_INTERNAL_ERROR) {
    return new TechnicalError('Erreur interne du serveur');
  }

  return new TechnicalError('Erreur inconnue');
}
