import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/questionList.module.css';
import { useQuestionsList } from '../../../hooks/question/useQuestionsList';
import btnStyles from '../../../styles/buttons.module.css';

const QuestionsList: React.FC = () => {
  const { toast, questions, isLoading, handleNavigateToNewQuestion } =
    useQuestionsList();

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
