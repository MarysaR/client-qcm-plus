import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { Result, Ok, Err, TechnicalError } from 'logic-qcm-plus';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function httpRequest<T>(
  promise: Promise<AxiosResponse<T>>
): Promise<Result<AxiosResponse<T>, TechnicalError>> {
  return promise
    .then(
      (res: AxiosResponse<T>): Result<AxiosResponse<T>, TechnicalError> =>
        Ok.of(res)
    )
    .catch(
      (err: AxiosError): Result<AxiosResponse<T>, TechnicalError> =>
        Err.of(
          new TechnicalError(
            (err.response?.data as { message?: string })?.message ||
              err.message ||
              'Erreur Axios'
          )
        )
    );
}
