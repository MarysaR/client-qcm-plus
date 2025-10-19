import React from 'react';
import { useUsersList } from '../../hooks/useUsersList';
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';
import '../../styles/usersList.css';
import btnStyles from '../../styles/buttons.module.css';

const UserList: React.FC = () => {
  const { users, loading } = useUsersList();
  const navigate = useNavigate();

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="user-list-page">
      <img
        src="src/assets/images/LogoQCM+SansLabelSansFond.png"
        alt="Logo"
        className="logo-top-right"
      />
      <div className="user-list-header">
        <h1 className="page-title">Liste des Stagiaires</h1>
      </div>

      <div className="actions-bar">
        <button
          type="button"
          className={btnStyles.appActionBtn}
          onClick={() => navigate('/stagiaires/new')}
        >
          Nouveau stagiaire
        </button>
      </div>

      <div className="user-list-container">
        <div className="user-list">
          {users && users.length > 0 ? (
            users.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <p>Aucun utilisateur trouvé.</p>
          )}
          <button className="button-new" onClick={() => navigate('/users/new')}>
            Nouveau
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
