import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestionsList } from '../../../hooks/question/useQuestionsList';
import { useQuestionDelete } from '../../../hooks/question/useQuestionDelete';
import btnStyles from '../../../styles/buttons.module.css';
import styles from '../../../styles/questionList.module.css';

const QuestionsList: React.FC = () => {
  const toast = useRef<Toast>(null);

  const { questions, setQuestions, isLoading, handleNavigateToNewQuestion } =
    useQuestionsList(toast);

  const { id } = useParams<{ id: string }>();
  const questionnaireId = id ? Number(id) : null;

  const { handleDeleteQuestion } = useQuestionDelete(
    toast,
    questionnaireId,
    (deletedId) => setQuestions((prev) => prev.filter((q) => q.id != deletedId))
  );

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Questions du questionnaire</h1>
        <Button
          label="Nouvelle question"
          icon="pi pi-plus"
          className={btnStyles.appActionBtn}
          onClick={handleNavigateToNewQuestion}
        />
      </div>

      {isLoading ? (
        <p className={styles.loadingText}>Chargement des questions...</p>
      ) : questions.length == 0 ? (
        <p className={styles.emptyText}>
          Aucune question trouvée pour ce questionnaire.
        </p>
      ) : (
        <div className={styles.cardsContainer}>
          {questions.map((question) => {
            const correctAnswers = question.answers.filter((a) => a.isCorrect);

            return (
              <Card key={question.id} className={styles.card}>
                <div className={styles.questionLabel}>
                  <strong>{question.label}</strong>
                </div>

                <div className={styles.answersCount}>
                  {question.answers.length} réponse
                  {question.answers.length > 1 ? 's' : ''}
                </div>

                {correctAnswers.length > 0 ? (
                  <div className={styles.correctAnswers}>
                    <strong>
                      Bonne{correctAnswers.length > 1 ? 's' : ''} réponse
                      {correctAnswers.length > 1 ? 's' : ''} :
                    </strong>
                    <ul>
                      {correctAnswers.map((a, i) => (
                        <li key={i}>{a.text}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className={styles.noCorrectAnswer}>
                    Aucune réponse correcte définie.
                  </div>
                )}

                <div className={styles.footerRow}>
                  <Button
                    label="Supprimer"
                    icon="pi pi-trash"
                    className={btnStyles.appActionBtnDanger}
                    onClick={() =>
                      question.id && handleDeleteQuestion(question.id)
                    }
                  />
                  <Button
                    label="Modifier"
                    icon="pi pi-pencil"
                    className={styles.editBtn}
                    onClick={() => navigate(`/questions/${question.id}/edit`)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
