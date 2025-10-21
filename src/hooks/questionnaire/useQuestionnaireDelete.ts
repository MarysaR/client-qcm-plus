import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { questionnaireService } from '../../services/questionnaire/questionnaireService';
import { RoleEnum, Result, AppError } from 'logic-qcm-plus';
import { useAuth } from '../../context/AuthContext';

export function useQuestionnaireDelete(onDeleted?: (id: number) => void) {
  const toast = useRef<Toast>(null);
  const { user } = useAuth();

  const handleDeleteQuestionnaire = async (questionnaireId: number) => {
    if (!user || user.roleId != RoleEnum.ADMIN) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Permission refusée',
        detail: 'Seul un administrateur peut supprimer un questionnaire.',
        life: 4000,
      });
      return;
    }

    if (!questionnaireId || isNaN(questionnaireId)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Identifiant de questionnaire invalide.',
        life: 4000,
      });
      return;
    }

    const result: Result<void, AppError> =
      await questionnaireService.deleteQuestionnaire(questionnaireId);

    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Suppression réussie',
        detail: 'Le questionnaire a été supprimé.',
        life: 3000,
      });
      onDeleted?.(questionnaireId);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
    }
  };

  return { toast, handleDeleteQuestionnaire };
}
