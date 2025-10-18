import React from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import styles from '../../../styles/question.module.css';
import { useQuestionForm } from '../../../hooks/question/useQuestionForm';

const Question: React.FC = () => {
  const {
    toast,
    navigate,
    label,
    setLabel,
    answers,
    setAnswers,
    handleAddAnswer,
    handleCreateQuestion,
    questionnaireId,
    questionnaireName,
    questionnaireDescription,
  } = useQuestionForm();

  return (
    <div className={styles.container}>
      <Toast ref={toast} />

      <h1 className={styles.title}>Nouvelle question</h1>

      <div className={styles.topRow}>
        <div className={styles.inputs}>
          <span className="p-float-label">
            <InputText
              id="nom"
              className={styles.input}
              value={questionnaireName}
              disabled
            />
            <label htmlFor="nom" className={styles.label}>
              Nom du Questionnaire
            </label>
          </span>

          <span className="p-float-label">
            <InputText
              id="description"
              className={styles.inputLarge}
              value={questionnaireDescription}
              disabled
            />
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
          </span>
        </div>

        <Button label="Enregistrer" className={styles.saveButton} />
      </div>

      <div className={styles.addQuestionWrapper}>
        <Button
          label="Voir les questions"
          className={styles.addQuestionBtn}
          onClick={() =>
            navigate(`/questionnaire/${questionnaireId}/questions`)
          }
        />
      </div>

      <Card className={styles.card}>
        <div className={styles.questionBlock}>
          <div className={styles.questionHeader}>
            <InputText
              placeholder="Écrire une question"
              className={styles.questionInput}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button
              label="Ajouter une question"
              className={styles.createQuestionBtn}
              onClick={handleCreateQuestion}
            />
          </div>

          <div className={styles.answers}>
            {answers.map((a, i) => (
              <div
                key={i}
                className={`${styles.answer} ${
                  styles[
                    `answer${
                      a.color.charAt(0).toUpperCase() + a.color.slice(1)
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
            ))}
          </div>

          <div className={styles.addAnswerWrapper}>
            <Button
              label="Ajouter une réponse"
              className={styles.addAnswerBtn}
              onClick={handleAddAnswer}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Question;
