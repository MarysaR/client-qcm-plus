import React from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import styles from '../../../styles/question.module.css';
import { useQuestionEdit } from '../../../hooks/question/useQuestionEdit';
import { EditableAnswer } from '../../../types/questionTypes';
import btnStyles from '../../../styles/buttons.module.css';

interface QuestionEditProps {
  questionId: number;
  onUpdated?: () => void;
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({
  questionId,
  onUpdated,
}) => {
  const {
    toast,
    label,
    setLabel,
    answers,
    setAnswers,
    handleAddAnswer,
    handleUpdateQuestion,
    isAddDisabled,
  } = useQuestionEdit(questionId);

  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      <h1 className={styles.title}>Modifier la question</h1>

      <div className={styles.topRow}>
        <div className={styles.inputs}>
          <span className="p-float-label">
            <InputText
              id="questionLabel"
              className={styles.questionInput}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Éditer la question"
            />

            <label htmlFor="questionLabel" className={styles.label}>
              Question
            </label>
          </span>
        </div>

        <Button
          label="Enregistrer"
          className={styles.saveButton}
          onClick={async () => {
            await handleUpdateQuestion();
            if (onUpdated) {
              onUpdated();
            }
          }}
        />
      </div>

      <Card className={styles.card}>
        <div className={styles.questionBlock}>
          <div className={styles.answers}>
            {answers.map(
              (a: EditableAnswer & { color?: string }, i: number) => (
                <div
                  key={i}
                  className={`${styles.answer} ${
                    styles[
                      `answer${
                        (a.color ?? 'Blue').charAt(0).toUpperCase() +
                        (a.color ?? 'Blue').slice(1)
                      }`
                    ]
                  }`}
                >
                  <textarea
                    className={styles.answerInput}
                    placeholder={`Réponse ${i + 1}`}
                    value={a.text}
                    onChange={(e) => {
                      const updated = [...answers];
                      updated[i].text = e.target.value;
                      setAnswers(updated);
                    }}
                  />
                  <div className={styles.answerFooter}>
                    <Checkbox
                      checked={a.isCorrect}
                      onChange={(e) => {
                        const updated = [...answers];
                        updated[i].isCorrect = e.checked ?? false;
                        setAnswers(updated);
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>

          <div className={styles.addAnswerWrapper}>
            <Button
              label="Ajouter une réponse"
              className={btnStyles.appActionBtnGhost}
              onClick={handleAddAnswer}
              disabled={isAddDisabled}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
