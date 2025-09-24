import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import '../../styles/style.css';
import { useNavigate } from 'react-router-dom';

const CustomSidebar: React.FC<{ role: string }> = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const menuItems = role === 'Stagiaire'
    ? [
        { icon: 'pi pi-user', label: 'Profil', path: '/profil' },
        {
          icon: 'pi pi-question-circle',
          label: 'Questionnaires',
          path: '/questionnaires',
        },
        { icon: 'pi pi-chart-bar', label: 'Statistiques', path: '/statistics' },
      ]
    : [
        { icon: 'pi pi-user', label: 'Profil', path: '/profil' },
        { icon: 'pi pi-users', label: 'Stagiaires', path: '/users' },
        {
          icon: 'pi pi-question-circle',
          label: 'Questionnaires',
          path: '/questionnaires',
        },
      ];

  return (
    <div className="custom-sidebar-container">
      {/* Sidebar réduite */}
      {isCollapsed && (
        <div className="collapsed-sidebar">
          <div className="sidebar-header">
            <span className="logo">
              <img
                src="src/assets/images/LogoQCM+PremiumSansLabel.PNG"
                alt="Logo"
              />
            </span>
          </div>

          <i
            className="pi pi-align-justify"
            onClick={() => setIsCollapsed(false)}
            title="Ouvrir le menu"
          ></i>
        </div>
      )}

      {/* Sidebar étendue */}
      <Sidebar
        visible={!isCollapsed}
        onHide={() => setIsCollapsed(true)}
        className="sidebar"
        showCloseIcon={false}
        dismissable={false}
        modal={false}
      >
        {/* Header avec logo et bouton retour */}
        <div className="sidebar-header">
          <span className="logo">
            <img src="src/assets/images/LogoQCM+Premiuim.PNG" alt="Logo" />
          </span>
          <Button
            icon="pi pi-arrow-left"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => setIsCollapsed(true)}
            tooltip="Replier"
          />
        </div>

        {/* Menu centré */}
        <div className="sidebar-menu">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              <a className="p-ripple" onClick={() => navigate(item.path)}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                <Ripple />
              </a>
            </div>
          ))}
        </div>

        {/*Déconnexion */}
        <div className="sidebar-logout">
          <a className="p-ripple">
            <i className="pi pi-sign-out"></i>
            <span>Logout</span>
            <Ripple />
          </a>
        </div>
      </Sidebar>
    </div>
  );
};

export default CustomSidebar;
