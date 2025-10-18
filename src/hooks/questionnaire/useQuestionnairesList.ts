import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { Questionnaire, RoleEnum } from 'logic-qcm-plus';
import { questionnaireService } from '../../services/questionnaire/questionnaireService';
import { useAuth } from '../../context/AuthContext';

export function useQuestionnairesList() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { user, setCurrentQuestionnaireId } = useAuth();

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      const result = await questionnaireService.getAllQuestionnaires();
      if (result.isOk()) {
        const list = result.value as Questionnaire[];
        const filtered =
          user?.roleId == RoleEnum.ADMIN
            ? list
            : list.filter((q) => q.isActive == true);
        setQuestionnaires(filtered);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: result.error.message,
          life: 4000,
        });
      }
      setIsLoading(false);
    };
    fetchQuestionnaires();
  }, [user]);

  const handleSelect = (q: Questionnaire) => {
    if (user?.roleId == RoleEnum.STAGIAIRE) {
      setCurrentQuestionnaireId(q.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Questionnaire sélectionné',
        detail: `Vous allez commencer "${q.name}"`,
        life: 3000,
      });
      navigate(`/questionnaire/${q.id}/questions`);
    }
  };

  return {
    toast,
    questionnaires,
    isLoading,
    handleSelect,
    user,
  };
}
