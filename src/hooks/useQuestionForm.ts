import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreateQuestionType } from '../types/questionTypes';
import { questionService } from '../services/question/questionService';
import { questionnaireService } from '../services/questionnaire/questionnaireService';
import { RoleEnum, Result, AppError } from 'logic-qcm-plus';
import { COLORS } from '../constants/colors';

export function useQuestionForm() {
  const toast = useRef<Toast>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const questionnaireId = Number(id);
  if (isNaN(questionnaireId) || questionnaireId <= 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Identifiant de questionnaire invalide ou manquant.',
      life: 4000,
    });
    navigate('/questionnaires');
  }

  const [label, setLabel] = useState('');
  const [answers, setAnswers] = useState<
    { text: string; isCorrect: boolean; color: string }[]
  >([{ text: '', isCorrect: false, color: 'red' }]);

  const [questionnaireName, setQuestionnaireName] = useState('');
  const [questionnaireDescription, setQuestionnaireDescription] = useState('');

  const MAX_ANSWERS = 5;

  useEffect(() => {
    const loadQuestionnaire = async () => {
      const result: Result<{ name: string; description?: string }, AppError> =
        await questionnaireService.getQuestionnaireById(questionnaireId);

      if (result.isErr()) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: result.error.message,
          life: 4000,
        });
        navigate('/questionnaires');
        return;
      }

      setQuestionnaireName(result.value.name);
      setQuestionnaireDescription(result.value.description ?? '');
    };

    void loadQuestionnaire();
  }, [questionnaireId]);

  const handleAddAnswer = () => {
    if (answers.length >= MAX_ANSWERS) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Limite atteinte',
        detail: 'Vous ne pouvez pas ajouter plus de 5 réponses.',
        life: 4000,
      });
      return;
    }

    const colorIndex = (answers.length - 1) % COLORS.length;
    const color = COLORS[colorIndex];
    const newAnswer = { text: '', isCorrect: false, color };
    setAnswers((prev) => [...prev, newAnswer]);
  };

  const handleCreateQuestion = async () => {
    if (!user || user.roleId != RoleEnum.ADMIN) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Permission refusée',
        detail: 'Seul un administrateur peut créer une question.',
        life: 4000,
      });
      return;
    }

    const command: CreateQuestionType = { label, questionnaireId, answers };

    const result = await questionService.createQuestion(command);
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Question créée avec succès.',
        life: 3000,
      });

      setLabel('');
      setAnswers([{ text: '', isCorrect: false, color: 'red' }]);

      navigate(`/questionnaire/${questionnaireId}/questions`);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
    }
  };

  const isAddDisabled = answers.length >= MAX_ANSWERS;

  return {
    toast,
    navigate,
    label,
    setLabel,
    answers,
    setAnswers,
    handleAddAnswer,
    handleCreateQuestion,
    isAddDisabled,
    questionnaireId,
    questionnaireName,
    questionnaireDescription,
  };
}
