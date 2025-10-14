import { AxiosResponse } from 'axios';
import { Result, Err, AppError } from 'logic-qcm-plus';

export async function mapHttpResult<T>(
  resResult: Result<Response | AxiosResponse, AppError>,
  onSuccess: (res: Response | AxiosResponse) => Promise<Result<T, AppError>>
): Promise<Result<T, AppError>> {
  if (resResult.isErr()) {
    return Err.of<T, AppError>(resResult.error);
  }

  return onSuccess(resResult.value);
}
