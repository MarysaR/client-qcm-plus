import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { questionService } from '../../services/question/questionService';
import { EditQuestionType, EditableAnswer } from '../../types//questionTypes';
import { RoleEnum, Result, AppError } from 'logic-qcm-plus';
import { COLORS } from '../../constants/colors';

export function useQuestionEdit(questionId: number) {
  const toast = useRef<Toast>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [label, setLabel] = useState<string>('');
  const [answers, setAnswers] = useState<EditableAnswer[]>([]);
  const [questionnaireId, setQuestionnaireId] = useState<number | null>(null);

  const MAX_ANSWERS = 5;

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId || questionId <= 0 || isNaN(questionId)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Identifiant de question invalide ou manquant.',
          life: 4000,
        });
        navigate('/questionnaires');
        return;
      }

      const result: Result<EditQuestionType, AppError> =
        await questionService.getQuestionById(questionId);

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

      const question = result.value;
      setLabel(question.label);
      setAnswers(
        question.answers.map((a, index) => ({
          ...a,
          color: COLORS[index % COLORS.length],
        }))
      );
      setQuestionnaireId(question.questionnaireId);
    };

    void loadQuestion();
  }, [questionId]);

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

    const colorIndex = answers.length % COLORS.length;
    const color = COLORS[colorIndex];
    const newAnswer: EditableAnswer & { color: string } = {
      text: '',
      isCorrect: false,
      color,
    };
    setAnswers((prev) => [...prev, newAnswer]);
  };

  const handleUpdateQuestion = async () => {
    if (!user || user.roleId != RoleEnum.ADMIN) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Permission refusée',
        detail: 'Seul un administrateur peut modifier une question.',
        life: 4000,
      });
      return;
    }

    if (!questionnaireId) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Questionnaire non défini.',
        life: 4000,
      });
      return;
    }

    const payload: EditQuestionType = {
      id: questionId,
      label,
      questionnaireId,
      answers,
    };

    const result = await questionService.updateQuestion(questionId, payload);
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Question mise à jour avec succès.',
        life: 3000,
      });

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
    handleUpdateQuestion,
    isAddDisabled,
    questionnaireId,
  };
}
