import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import styles from '../../styles/questionnaireModal.module.css';
import { useQuestionnaireEdit } from '../../hooks/questionnaire/useQuestionnaireEdit';

interface Props {
  questionnaireId: number | null;
  visible: boolean;
  onHide: () => void;
  onUpdated: () => void;
}

const UpdateQuestionnaireModal: React.FC<Props> = ({
  questionnaireId,
  visible,
  onHide,
  onUpdated,
}) => {
  const {
    toast,
    loading,
    saving,
    error,
    name,
    setName,
    description,
    setDescription,
    handleUpdateQuestionnaire,
    reload,
  } = useQuestionnaireEdit(questionnaireId, onUpdated);

  useEffect(() => {
    if (visible) reload();
  }, [visible, reload]);

  const save = async () => {
    const ok = await handleUpdateQuestionnaire();
    if (ok) onHide();
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button
        label="Annuler"
        icon="pi pi-times"
        className={styles.btnCancel}
        onClick={onHide}
        disabled={saving}
      />
      <Button
        label={saving ? 'Enregistrement...' : 'Mettre à jour'}
        icon="pi pi-save"
        className={styles.btnPrimary}
        onClick={save}
        disabled={saving || !name.trim()}
      />
    </div>
  );

  return (
    <Dialog
      header="Modifier le questionnaire"
      visible={visible}
      style={{ width: '32rem' }}
      modal
      onHide={onHide}
      footer={footer}
      className={styles.dialog}
    >
      <Toast ref={toast} />
      {loading && <p>Chargement...</p>}
      {!loading && (
        <div
          className={styles.body}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.field}>
            <label className={styles.label}>Nom</label>
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <InputTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={styles.textarea}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      )}
    </Dialog>
  );
};

export default UpdateQuestionnaireModal;
