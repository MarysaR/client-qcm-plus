import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenue sur QCM-PLUS</h1>
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
