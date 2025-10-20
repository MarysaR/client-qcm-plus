import {
  Ok,
  Err,
  PermissionDeniedError,
  TechnicalError,
  NotFoundError,
  Result,
  AppError,
} from 'logic-qcm-plus';
import {
  CREATE_QUESTION,
  GET_QUESTIONS_OF_QUESTIONNAIRE,
  UPDATE_QUESTION,
} from '../../constants/endpoints';
import { authService } from '../auth/authService';
import { CreateQuestionType, EditQuestionType } from 'src/types/questionTypes';
import { httpRequest, httpClient } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError } from '../../utils/httpUtils';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const questionService = {
  async getQuestionsOfQuestionnaire(questionnaireId: number) {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.get(
        `${GET_QUESTIONS_OF_QUESTIONNAIRE}/${questionnaireId}/questions`,
        { headers: { Authorization: 'Bearer ' + token } }
      )
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
            'Réponse invalide du serveur (questions manquantes)'
          )
        );
      }

      return Ok.of(body);
    });
  },

  async getQuestionById(
    questionId: number
  ): Promise<Result<EditQuestionType, AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.get(`/questions/${questionId}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      let status: number;
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

      if (status == HTTP_STATUS.NOT_FOUND) {
        return Err.of(new NotFoundError('Question introuvable'));
      }

      if (status < HTTP_STATUS.OK || status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      const question = body as EditQuestionType;
      if (!question.label || !Array.isArray(question.answers)) {
        return Err.of(
          new TechnicalError(
            'Réponse invalide du serveur (question incomplète)'
          )
        );
      }

      return Ok.of(question);
    });
  },

  async createQuestion(command: CreateQuestionType) {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.post(CREATE_QUESTION, command, {
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

      const statusInvalide =
        status < HTTP_STATUS.OK ||
        (status >= HTTP_STATUS.BAD_REQUEST &&
          status < HTTP_STATUS.INTERNAL_SERVER_ERROR);

      if (statusInvalide) {
        return Err.of(mapHttpError(status));
      }

      return Ok.of(undefined);
    });
  },

  async updateQuestion(
    questionId: number,
    payload: EditQuestionType
  ): Promise<Result<void, AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.put(`${UPDATE_QUESTION}/${questionId}`, payload, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      let status: number;
      if ('status' in res) {
        status = res.status;
      } else {
        status = (res as Response).status;
      }

      if (status == HTTP_STATUS.NOT_FOUND) {
        return Err.of(new NotFoundError('Question introuvable'));
      }

      if (status < HTTP_STATUS.OK || status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      return Ok.of(undefined);
    });
  },

  async deleteQuestion(questionId: number): Promise<Result<void, AppError>> {
    const token = authService.getToken();
    if (!token) {
      return Err.of(
        new PermissionDeniedError(
          'Utilisateur non authentifié (token manquant)'
        )
      );
    }

    const resResult = await httpRequest(
      httpClient.delete(`/questions/${questionId}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
    );

    return mapHttpResult(resResult, async (res) => {
      let status: number;
      if ('status' in res) {
        status = res.status;
      } else {
        status = (res as Response).status;
      }

      if (status == HTTP_STATUS.NOT_FOUND) {
        return Err.of(new NotFoundError('Question introuvable'));
      }

      if (status < HTTP_STATUS.OK || status >= HTTP_STATUS.BAD_REQUEST) {
        return Err.of(mapHttpError(status));
      }

      return Ok.of(undefined);
    });
  },
};
