import { useRef, useState } from 'react';
import { questionnaireService } from '../services/questionnaire/questionnaireService';
import { CreateQuestionnairePayload } from '../payload/questionnairePayload';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

export const useCreateQuestionnaire = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const handleCreated = async () => {
    if (typeof window !== 'undefined') {
      navigate('/questionnaires');
    }
    toast.current?.show({
      severity: 'success',
      summary: 'Succès',
      detail: 'Questionnaire créé',
      life: 3000,
    });
  };
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
    handleCreated,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};
