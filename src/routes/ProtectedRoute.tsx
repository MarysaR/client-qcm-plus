import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  // Donner le temps au contexte de vérifier l'authentification
  if (user == undefined || user == null) {
    return <div className="text-center mt-10 text-gray-500">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
