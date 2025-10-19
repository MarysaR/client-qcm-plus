import React from 'react';
import { useParams } from 'react-router-dom';
import { QuestionEdit } from '../../components/questionnaires/question/QuestionEdit';

const QuestionEditPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();

  if (!questionId || isNaN(Number(questionId))) {
    return <p>Identifiant de question invalide</p>;
  }

  return <QuestionEdit questionId={Number(questionId)} />;
};

export default QuestionEditPage;
