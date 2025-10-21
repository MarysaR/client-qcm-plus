import React from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useQuestionnairesList } from '../../hooks/questionnaire/useQuestionnairesList';
import { useQuestionnaireDelete } from '../../hooks/questionnaire/useQuestionnaireDelete';
import { Questionnaire, RoleEnum } from 'logic-qcm-plus';
import styles from '../../styles/questionnaireList.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateQuestionnaireModal from './CreateQuestionnaireModal';
import UpdateQuestionnaireModal from './UpdateQuestionnaireModal';
import btnStyles from '../../styles/buttons.module.css';

const Questionnaires: React.FC = () => {
  const { toast, questionnaires, isLoading, user, reload } =
    useQuestionnairesList();
  const { setCurrentQuestionnaireId } = useAuth();
  const navigate = useNavigate();

  const { toast: deleteToast, handleDeleteQuestionnaire } =
    useQuestionnaireDelete((deletedId) => {
      setLocalQuestionnaires((prev) => prev.filter((q) => q.id !== deletedId));
    });

  const [localQuestionnaires, setLocalQuestionnaires] =
    React.useState<Questionnaire[]>(questionnaires);
  React.useEffect(
    () => setLocalQuestionnaires(questionnaires),
    [questionnaires]
  );

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

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Confirmer la suppression de ce questionnaire ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      className: styles.confirmDialog,
      acceptClassName: btnStyles.appActionBtnDanger,
      rejectClassName: btnStyles.appActionBtnGhost,
      accept: () => handleDeleteQuestionnaire(id),
    });
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} className={styles.toast} />
      <Toast ref={deleteToast} />
      <ConfirmDialog />

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
          {localQuestionnaires.map((q) => (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(q.id);
                    }}
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

          {localQuestionnaires.length == 0 && (
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
