import React from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useQuestionnairesList } from '../../hooks/questionnaire/useQuestionnairesList';
import { Questionnaire, RoleEnum } from 'logic-qcm-plus';
import styles from '../../styles/questionnaireList.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateQuestionnaireModal from './CreateQuestionnaireModal';
import btnStyles from '../../styles/buttons.module.css';
import UpdateQuestionnaireModal from './UpdateQuestionnaireModal';

const Questionnaires: React.FC = () => {
  const { toast, questionnaires, isLoading, user, reload } =
    useQuestionnairesList();
  const { setCurrentQuestionnaireId } = useAuth();
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = React.useState(false);
  const [editVisible, setEditVisible] = React.useState(false);
  const [editId, setEditId] = React.useState<number | null>(null);

  const openEdit = (id: number) => {
    setEditId(id);
    setEditVisible(true);
  };

  const handleCreated = async () => {
    await reload();
    toast.current?.show({
      severity: 'success',
      summary: 'Succès',
      detail: 'Questionnaire créé avec succès',
      life: 3000,
    });
  };

  const handleCardClick = (q: Questionnaire) => {
    if (editVisible) return;
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
            className={btnStyles.appActionBtn}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(q.id);
                    }}
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

      <UpdateQuestionnaireModal
        questionnaireId={editId}
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        onUpdated={reload}
      />
    </div>
  );
};

export default Questionnaires;
