import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { questionService } from '../../services/question/questionService';
import { RoleEnum, Result, AppError } from 'logic-qcm-plus';

export function useQuestionDelete(
  toast: React.RefObject<Toast | null>,
  questionnaireId: number | null,
  onDeleted?: (questionId: number) => void
) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDeleteQuestion = async (questionId: number) => {
    if (!user || user.roleId != RoleEnum.ADMIN) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Permission refusée',
        detail: 'Seul un administrateur peut supprimer une question.',
        life: 4000,
      });
      return;
    }

    if (!questionId || isNaN(questionId)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Identifiant de question invalide.',
        life: 4000,
      });
      return;
    }

    const result: Result<void, AppError> =
      await questionService.deleteQuestion(questionId);
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Suppression réussie',
        detail: 'La question a été supprimée avec succès.',
        life: 3000,
      });

      if (onDeleted) {
        onDeleted(questionId);
      } else if (questionnaireId) {
        navigate(`/questionnaire/${questionnaireId}/questions`);
      } else {
        navigate('/questionnaires');
      }
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
    }
  };

  return {
    handleDeleteQuestion,
  };
}
