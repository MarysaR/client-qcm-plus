import React, { useMemo } from 'react';
import { User } from 'logic-qcm-plus';
import 'primeicons/primeicons.css';
import '../../styles/usersList.css';

interface Props {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

const UserCard: React.FC<Props> = ({ user }) => {
  const randomAvatar = useMemo(() => {
    const index = Math.floor(Math.random() * 3) + 1;
    return `src/assets/avatars/avatar${index}.PNG`;
  }, []);

  //TODO: ajouter les fonctions onEdit et onDelete
  return (
    <div className="user-card">
      <img src={randomAvatar} alt="Avatar" className="avatar-preview" />
      <p>
        <strong>Nom:</strong> {user.lastName}
      </p>
      <p>
        <strong>Prénom:</strong> {user.firstName}
      </p>
      <p>
        <strong>Login:</strong> {user.login}
      </p>
      <p className="email">
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Entreprise:</strong> {user.company}
      </p>
      <p>
        <strong>Créé le:</strong>{' '}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <div className="actions">
        <button>
          <i className="pi pi-pencil"></i>
        </button>
        <button>
          <i className="pi pi-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default UserCard;
