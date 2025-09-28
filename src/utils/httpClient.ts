import { Result, TechnicalError } from 'logic-qcm-plus';

export async function httpRequest(
  input: RequestInfo,
  init?: RequestInit
): Promise<Result<Response, TechnicalError>> {
  try {
    const res = await fetch(input, init);
    return { isOk: () => true, isErr: () => false, value: res } as Result<
      Response,
      TechnicalError
    >;
  } catch {
    return {
      isOk: () => false,
      isErr: () => true,
      error: new TechnicalError('Erreur réseau'),
    } as Result<Response, TechnicalError>;
  }
}
