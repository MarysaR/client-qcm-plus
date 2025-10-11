import {
  Result,
  Ok,
  Err,
  AppError,
  ValidationError,
  PermissionDeniedError,
} from 'logic-qcm-plus';
import { httpRequest } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError, parseJsonSafe } from '../../utils/httpUtils';
import { authService } from '../auth/authService';
import { CREATE_QUESTION } from '../../constants/endpoints';
import { CreateQuestionDto } from 'src/types/questionTypes';

export const questionService = {
  async createQuestion(
    command: CreateQuestionDto
  ): Promise<Result<void, AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    if (
      typeof command.label != 'string' ||
      typeof command.questionnaireId != 'number' ||
      !Array.isArray(command.answers)
    ) {
      return Err.of(
        new ValidationError('Format des données de la question invalide')
      );
    }

    const resResult = await httpRequest(CREATE_QUESTION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(command),
    });

    return mapHttpResult<void>(resResult, async (res) => {
      if (!res.ok) {
        const body = await parseJsonSafe<{ error?: string }>(res);
        const message =
          body?.error ?? 'Erreur lors de la création de la question';
        return Err.of(mapHttpError(res.status, message));
      }

      return Ok.of(undefined);
    });
  },
};
