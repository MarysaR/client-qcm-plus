import React from 'react';
import CreateQuestionnaireModal from '../../components/questionnaires/CreateQuestionnaireModal';
import { useNavigate } from 'react-router-dom';

const QuestionnaireCreatePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <CreateQuestionnaireModal
      visible={true}
      onHide={() => navigate('/questionnaires')}
      onCreated={() => navigate('/questionnaires')}
    />
  );
};

export default QuestionnaireCreatePage;
