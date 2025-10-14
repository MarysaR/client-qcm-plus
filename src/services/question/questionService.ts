import { Ok, Err, PermissionDeniedError, TechnicalError } from 'logic-qcm-plus';
import { httpRequest, httpClient } from '../../utils/httpClient';
import { mapHttpResult } from '../../utils/httpResultMapper';
import { mapHttpError } from '../../utils/httpUtils';
import { authService } from '../auth/authService';
import {
  CREATE_QUESTION,
  GET_QUESTIONS_OF_QUESTIONNAIRE,
} from '../../constants/endpoints';
import { HTTP_STATUS } from '../../constants/httpStatus';
import { CreateQuestionType } from 'src/types/questionTypes';

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
};
