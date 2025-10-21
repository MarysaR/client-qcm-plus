import { useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Question } from 'logic-qcm-plus';
import { questionService } from '../../services/question/questionService';

export function useQuestionsList(toast: React.RefObject<Toast | null>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Identifiant de questionnaire manquant',
          life: 4000,
        });
        return;
      }

      const result = await questionService.getQuestionsOfQuestionnaire(
        Number(id)
      );

      if (result.isOk()) {
        const list = result.value as Question[];
        setQuestions(list);

        if (list.length == 0) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Information',
            detail: 'Aucune question trouvée pour ce questionnaire.',
            life: 4000,
          });
        }
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

    fetchQuestions();
  }, [id]);

  const handleNavigateToNewQuestion = () => {
    if (id) navigate(`/questionnaire/${id}/new-question`);
  };

  return {
    toast,
    questions,
    setQuestions,
    isLoading,
    handleNavigateToNewQuestion,
  };
}
