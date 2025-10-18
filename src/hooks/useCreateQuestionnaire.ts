import { useState } from 'react';
import { questionnaireService } from '../services/questionnaire/questionnaireService';
import { CreateQuestionnairePayload } from '../types/questionnaireTypes';

export const useCreateQuestionnaire = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const create = async (payload: CreateQuestionnairePayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await questionnaireService.createQuestionnaire(payload);
    if (result.isErr()) {
      setError(result.error.message);
      setLoading(false);
      return false;
    }
    setSuccess(true);
    setLoading(false);
    return true;
  };

  return {
    create,
    loading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};
