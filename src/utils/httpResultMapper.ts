import { Result, Err, AppError } from 'logic-qcm-plus';

/**
 * Transforme un Result<Response, AppError> en Result<T, AppError>
 * en appliquant une fonction de mapping si la réponse est Ok.
 */
export async function mapHttpResult<T>(
  resResult: Result<Response, AppError>,
  onOk: (res: Response) => Promise<Result<T, AppError>>
): Promise<Result<T, AppError>> {
  if (resResult.isErr()) {
    return Err.of<T, AppError>(resResult.error);
  }

  return onOk(resResult.value);
}
