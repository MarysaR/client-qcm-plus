import React, { useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import styles from '../../../styles/question.module.css';
import { Toast } from 'primereact/toast';
import { CreateQuestionDto } from '../../../types/questionTypes';
import { questionService } from '../../../services/question/questionService';
// import { useNavigate } from 'react-router-dom';

// TODO: Récupérer le questionnaireId dynamiquement et redigirer vers la liste des questions
// const navigate = useNavigate();

const Question: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [label, setLabel] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  const questionnaireId = 1;

  const handleCreateQuestion = async () => {
    const command: CreateQuestionDto = {
      label,
      questionnaireId,
      answers,
    };

    const result = await questionService.createQuestion(command);
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Question créée avec succès.',
        life: 3000,
      });

      setLabel('');
      setAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nouveau Questionnaire</h1>

      <div className={styles.topRow}>
        <div className={styles.inputs}>
          <span className="p-float-label">
            <InputText id="nom" className={styles.input} />
            <label htmlFor="nom" className={styles.label}>
              Nom du Questionnaire
            </label>
          </span>

          <span className="p-float-label">
            <InputText id="description" className={styles.inputLarge} />
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
          //TODO pour le GET Question et non pas Questionnaire: onClick={() =>
          //   navigate(`/questions/${questionnaireId}`)
          // }
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
                  [
                    styles.answerBlue,
                    styles.answerYellow,
                    styles.answerRed,
                    styles.answerPurple,
                  ][i]
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
              onClick={() =>
                setAnswers([...answers, { text: '', isCorrect: false }])
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Question;
