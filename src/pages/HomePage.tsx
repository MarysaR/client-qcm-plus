import React, { useState } from 'react';
import CustomSidebar from '../components/CustomSidebar';

const HomePage: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div
      className="homepage background-image"
      style={{
        display: 'flex',
        height: '100vh', 
        overflow: 'hidden', 
        position: 'relative',
      }}
    >
      {/* Image de fond */}
      <img
        src="src/assets/images/fond.png"
        alt="Background"
        className="background-image"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <CustomSidebar role="Admin" />

      {/* Contenu principal */}
      <div
        className="content"
        style={{
          alignContent: 'center',
          position: 'fixed',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#C8C8C6',
            fontFamily: 'Inter sans-serif',
          }}
        >
          Bienvenue sur
        </h1>
        <img
          src="src/assets/images/LogoQCM+SansFond.png"
          alt="Logo"
          className="logo"
          style={{
            marginLeft: '5px',
            width: '20em',
            height: 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;