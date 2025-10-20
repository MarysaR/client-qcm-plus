import { useCallback, useEffect, useRef, useState } from 'react';
import { questionnaireService } from '../../services/questionnaire/questionnaireService';
import { UpdateQuestionnairePayload } from '../../payload/questionnairePayload';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/AuthContext';
import { RoleEnum } from 'logic-qcm-plus';

export function useQuestionnaireEdit(
  questionnaireId: number | null,
  onUpdated?: () => void
) {
  const toast = useRef<Toast>(null);
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState<string | undefined>('');

  const load = useCallback(async () => {
    if (!questionnaireId) return;
    setLoading(true);
    setError(null);

    const result =
      await questionnaireService.getQuestionnaireById(questionnaireId);
    if (result.isErr()) {
      setError(result.error.message);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
      setLoading(false);
      return;
    }

    setName(result.value.name);
    setDescription(result.value.description);
    setLoading(false);
  }, [questionnaireId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdateQuestionnaire = useCallback(async (): Promise<boolean> => {
    if (!questionnaireId) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Identifiant questionnaire manquant.',
        life: 4000,
      });
      return false;
    }

    if (!user || user.roleId != RoleEnum.ADMIN) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Permission refusée',
        detail: 'Seul un administrateur peut modifier un questionnaire.',
        life: 4000,
      });
      return false;
    }

    if (!name.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Le nom est requis.',
        life: 3500,
      });
      return false;
    }

    setSaving(true);
    setError(null);

    const payload: UpdateQuestionnairePayload = {
      id: questionnaireId,
      name: name.trim(),
      description: description?.trim(),
    };

    const result = await questionnaireService.updateQuestionnaire(
      questionnaireId,
      payload
    );

    if (result.isErr()) {
      setError(result.error.message);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
      setSaving(false);
      return false;
    }

    setSaving(false);
    toast.current?.show({
      severity: 'success',
      summary: 'Succès',
      detail: 'Questionnaire mis à jour.',
      life: 3000,
    });
    onUpdated?.();
    return true;
  }, [questionnaireId, user, name, description, onUpdated]);

  const reset = () => {
    setError(null);
  };

  return {
    toast,
    loading,
    saving,
    error,
    name,
    setName,
    description,
    setDescription,
    handleUpdateQuestionnaire,
    reload: load,
    reset,
  };
}
