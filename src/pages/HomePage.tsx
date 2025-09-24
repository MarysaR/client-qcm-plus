import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from 'primereact/button';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Bienvenue sur QCM-PLUS</h1>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user.username} {user.role && `(${user.role})`}
            </span>
            <Button
              onClick={logout}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Déconnexion
            </Button>
          </div>
        )}
      </div>
      <Link
        to="/users"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Gérer les utilisateurs
      </Link>
    </div>
  );
};

export default HomePage;
