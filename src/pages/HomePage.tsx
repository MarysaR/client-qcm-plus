import React from 'react';
import '../styles/style.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      {/* Image de fond */}
      <img
        src="src/assets/images/fond.png"
        alt="Background"
        className="background-image"
      />

      {/* Contenu principal */}
      <div className="content">
        <h1>Bienvenue sur</h1>
        <img
          src="src/assets/images/LogoQCM+SansFond.png"
          alt="Logo"
          className="logo"
        />
      </div>
    </div>
  );
};

export default HomePage;
