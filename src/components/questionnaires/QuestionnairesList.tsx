import React from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useQuestionnairesList } from '../../hooks/questionnaire/useQuestionnairesList';
import { Questionnaire, RoleEnum } from 'logic-qcm-plus';
import styles from '../../styles/questionnaireList.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateQuestionnaireModal from './CreateQuestionnaireModal';
import { useCreateQuestionnaire } from '../../hooks/questionnaire/useCreateQuestionnaire';

const Questionnaires: React.FC = () => {
  const { toast, questionnaires, isLoading, user } = useQuestionnairesList();
  const { handleCreated } = useCreateQuestionnaire();
  const { setCurrentQuestionnaireId } = useAuth();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = React.useState(false);

  const handleCardClick = (q: Questionnaire) => {
    setCurrentQuestionnaireId(q.id);
    navigate(`/questionnaire/${q.id}/questions`);
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} className={styles.toast} />
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Liste des questionnaires</h1>
        {user?.roleId == RoleEnum.ADMIN && (
          <Button
            label="Ajouter questionnaire"
            icon="pi pi-plus"
            className="p-button-sm"
            onClick={() => setShowCreate(true)}
          />
        )}
      </div>

      {isLoading ? (
        <p className={styles.loading}>Chargement...</p>
      ) : (
        <div className={styles.grid}>
          {questionnaires.map((q) => (
            <div
              key={q.id}
              className={styles.card}
              onClick={() => handleCardClick(q)}
            >
              <h2 className={styles.cardTitle}>{q.name}</h2>
              <p className={styles.cardSubtitle}>{q.description}</p>
              <p className={styles.meta}>
                Créé le {new Date(q.createdAt).toLocaleDateString()}
              </p>

              {user?.roleId == RoleEnum.ADMIN && (
                <div className={styles.actions}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    disabled
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-button-text p-button-sm"
                    disabled
                  />
                  <Button
                    icon={q.isActive ? 'pi pi-check' : 'pi pi-times'}
                    className={`p-button-sm ${
                      q.isActive ? styles.activeBtn : styles.inactiveBtn
                    }`}
                    disabled
                  />
                </div>
              )}
            </div>
          ))}
          {questionnaires.length == 0 && (
            <div className={styles.empty}>Aucun questionnaire.</div>
          )}
        </div>
      )}

      <CreateQuestionnaireModal
        visible={showCreate}
        onHide={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default Questionnaires;
