import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

export function useSidebarQuestionNavigation(
  currentQuestionnaireId: number | null,
  toast: React.RefObject<Toast | null>
) {
  const navigate = useNavigate();

  function goTo(path: string) {
    navigate(path);
  }

  function handleQuestionNavigation() {
    if (currentQuestionnaireId && !isNaN(currentQuestionnaireId)) {
      navigate(`/questionnaire/${currentQuestionnaireId}/questions`);
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Aucun questionnaire sélectionné',
        detail:
          'Veuillez d’abord choisir un questionnaire avant d’accéder aux questions.',
        life: 4000,
      });
    }
  }

  return { goTo, handleQuestionNavigation };
}
