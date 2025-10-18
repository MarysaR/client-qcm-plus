import {
  Ok,
  Err,
  PermissionDeniedError,
  TechnicalError,
  ValidationError,
  Result,
  AppError,
} from 'logic-qcm-plus';
import { httpRequest, httpClient } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError } from '../../utils/httpUtils';
import { authService } from '../auth/authService';
import { HTTP_STATUS } from '../../constants/httpStatus';
import { CreateQuestionnairePayload } from 'src/payload/questionnairePayload';
import { CREATE_QUESTIONNAIRE } from '../../constants/endpoints';

const BASE_URL = '/questionnaires';

export const questionnaireService = {
  async getAll() {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.get(BASE_URL, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      let status;
      if ('status' in res) {
        status = res.status;
      } else {
        status = (res as Response).status;
      }

      let body = {};
      if ('data' in res) {
        body = res.data;
      } else {
        const json = await (res as Response).json();
        if (typeof json == 'object' && json != null) {
          body = json;
        }
      }

      const statusInvalide =
        status < HTTP_STATUS.OK ||
        (status >= HTTP_STATUS.BAD_REQUEST &&
          status < HTTP_STATUS.INTERNAL_SERVER_ERROR);

      if (statusInvalide) {
        return Err.of(mapHttpError(status));
      }

      if (!Array.isArray(body)) {
        return Err.of(
          new TechnicalError(
            'Réponse invalide du serveur (questionnaires manquants)'
          )
        );
      }

      return Ok.of(body);
    });
  },

  async createQuestionnaire(payload: CreateQuestionnairePayload) {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }
    if (!payload.name || !payload.name.trim()) {
      return Err.of(new ValidationError('Le nom du questionnaire est requis'));
    }

    const resResult = await httpRequest(
      httpClient.post(
        CREATE_QUESTIONNAIRE,
        {
          name: payload.name.trim(),
          description: payload.description?.trim() || undefined,
        },
        { headers: { Authorization: 'Bearer ' + token } }
      )
    );

    return mapHttpResult(resResult, async (res) => {
      const status = 'status' in res ? res.status : (res as Response).status;
      if (status < HTTP_STATUS.OK || status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }
      return Ok.of(undefined);
    });
  },
  async getQuestionnaireById(
    id: number
  ): Promise<Result<{ name: string; description?: string }, AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.get(`/questionnaire/${id}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      let status;
      if ('status' in res) {
        status = res.status;
      } else {
        status = (res as Response).status;
      }

      let body = {};
      if ('data' in res) {
        body = res.data;
      } else {
        const json = await (res as Response).json();
        if (typeof json == 'object' && json !== null) {
          body = json;
        }
      }

      const statusInvalide =
        status < HTTP_STATUS.OK ||
        (status >= HTTP_STATUS.BAD_REQUEST &&
          status < HTTP_STATUS.INTERNAL_SERVER_ERROR);

      if (statusInvalide) {
        return Err.of(mapHttpError(status));
      }

      const questionnaire = body as { name?: string; description?: string };

      if (!questionnaire.name) {
        return Err.of(
          new TechnicalError(
            'Réponse invalide du serveur (questionnaire incomplet)'
          )
        );
      }

      return Ok.of({
        name: questionnaire.name,
        description: questionnaire.description,
      });
    });
  },
};
