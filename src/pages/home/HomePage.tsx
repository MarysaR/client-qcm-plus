import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../../styles/style.css';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const toast = useRef<Toast | null>(null);

  async function handleLogout() {
    const result = await logout();
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Déconnexion réussie',
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
      });
    }
  }

  return (
    <div className="homepage relative min-h-screen">
      <Toast ref={toast} />

      {/* Image de fond */}
      <img
        src="src/assets/images/fond.png"
        alt="Background"
        className="background-image"
      />

      {/* Header utilisateur */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-white/70 backdrop-blur">
        <h1 className="text-xl font-bold">Bienvenue sur QCM-PLUS</h1>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user.email} {user.role && `(${user.role})`}
            </span>
            <Button
              onClick={handleLogout}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Déconnexion
            </Button>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="content relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenue sur</h1>
        <img
          src="src/assets/images/LogoQCM+SansFond.png"
          alt="Logo"
          className="logo mb-6"
        />
        <Link
          to="/users"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gérer les utilisateurs
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
