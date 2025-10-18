import React, { useEffect, useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useCreateQuestionnaire } from '../../hooks/useCreateQuestionnaire';
import styles from '../../styles/questionnaireModal.module.css';

interface Props {
  visible: boolean;
  onHide: () => void;
  onCreated?: () => void;
}

const CreateQuestionnaireModal: React.FC<Props> = ({
  visible,
  onHide,
  onCreated,
}) => {
  const { create, loading, error, success, reset } = useCreateQuestionnaire();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    reset();
  }, [reset]);

  useEffect(() => {
    if (!visible) resetForm();
  }, [visible, resetForm]);

  const save = async () => {
    const ok = await create({ name, description });
    if (ok) {
      onCreated?.();
      onHide();
    }
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button
        label="Annuler"
        icon="pi pi-times"
        className={styles.btnCancel}
        outlined
        onClick={onHide}
        disabled={loading}
      />
      <Button
        label={loading ? 'Enregistrement...' : 'Créer'}
        icon="pi pi-save"
        className={styles.btnPrimary}
        onClick={save}
        disabled={loading || !name.trim()}
      />
    </div>
  );

  return (
    <Dialog
      header="Créer un questionnaire"
      visible={visible}
      style={{ width: '32rem' }}
      modal
      onHide={onHide}
      footer={footer}
      className={styles.dialog}
    >
      <div className={styles.body}>
        <div className={styles.field}>
          <label className={styles.label}>Nom</label>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Onboarding"
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
        {success && <div className={styles.success}>Questionnaire créé</div>}
      </div>
    </Dialog>
  );
};

export default CreateQuestionnaireModal;
