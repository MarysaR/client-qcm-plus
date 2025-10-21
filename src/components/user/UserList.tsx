import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsersList } from '../../hooks/useUsersList';
import styles from '../../styles/userList.module.css';

const UserList: React.FC = () => {
  const { users, loading } = useUsersList();
  const navigate = useNavigate();

  if (loading) return <p>Chargement...</p>;

  const formatDate = (dateInput?: string | Date | null): string => {
    if (!dateInput) return '';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Liste des Stagiaires</h1>
        <button
          className={styles.addBtn}
          onClick={() => navigate('/stagiaires/new')}
        >
          Nouveau stagiaire
        </button>
      </div>

      <div className={styles.grid}>
        {users.map((user) => (
          <div key={user.id} className={styles.card}>
            <div className={styles.info}>
              <div className={styles.avatarWrapper}>
                <img
                  src="/src/assets/images/default-avatar.png"
                  alt="Avatar"
                  className={styles.avatar}
                />
              </div>
              <div className={styles.details}>
                <p className={styles.detailItem}>
                  <strong>Nom:</strong> {user.lastName}
                </p>
                <p className={styles.detailItem}>
                  <strong>Prénom:</strong> {user.firstName}
                </p>
                <p className={styles.detailItem}>
                  <strong>Login:</strong> {user.login}
                </p>
                <p className={styles.detailItem}>
                  <strong>Email:</strong> {user.email}
                </p>
                <p className={styles.detailItem}>
                  <strong>Entreprise:</strong> {user.company}
                </p>
                <p className={styles.detailItem}>
                  <strong>Créé le:</strong> {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <button className="pi pi-pencil" />
              <button className="pi pi-trash" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
