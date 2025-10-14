import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import '../../styles/style.css';
import { useAuth } from '../../context/AuthContext';
import { RoleEnum } from 'logic-qcm-plus';

const CustomSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { logout, currentQuestionnaireId } = useAuth();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isCollapsed ? '3rem' : '6.5rem'
    );
  }, [isCollapsed]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Vous avez été déconnecté',
        life: 3000,
      });
      navigate('/login');
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
    }
  };
  const { user: currentUser } = useAuth() || {};
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  let payload = currentUser;

  const role = payload.roleId;

  const handleQuestionNavigation = () => {
    if (currentQuestionnaireId && !isNaN(currentQuestionnaireId)) {
      navigate(`/questionnaire/${currentQuestionnaireId}/questions`);
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Aucun questionnaire sélectionné',
        detail:
          'Veuillez d’abord choisir un questionnaire avant d’accéder aux questions.',
        life: 4000,
      });
    }
  };

  const menuItems = role
    ? [
        { icon: 'pi pi-user', label: 'Profil', path: '/me' },
        {
          icon: 'pi pi-book',
          label: 'Questionnaires',
          path: '/questionnaires',
        },
        {
          icon: 'pi pi-question-circle',
          label: 'Questions',
          action: handleQuestionNavigation,
        },
        { icon: 'pi pi-chart-bar', label: 'Statistiques', path: '/statistics' },
      ]
    : [
        { icon: 'pi pi-user', label: 'Profil', path: '/me' },
        { icon: 'pi pi-users', label: 'Stagiaires', path: '/users' },
        {
          icon: 'pi pi-book',
          label: 'Questionnaires',
          path: '/questionnaires',
        },
        {
          icon: 'pi pi-question-circle',
          label: 'Questions',
          action: handleQuestionNavigation,
        },
      ];
  const menuItems =
    role == RoleEnum.STAGIAIRE
      ? [
          { icon: 'pi pi-user', label: 'Profil', path: '/me' },
          {
            icon: 'pi pi-question-circle',
            label: 'Question',
            path: '/question',
          },
          {
            icon: 'pi pi-chart-bar',
            label: 'Statistiques',
            path: '/statistics',
          },
        ]
      : [
          { icon: 'pi pi-user', label: 'Profil', path: '/me' },
          { icon: 'pi pi-users', label: 'Stagiaires', path: '/users' },
          {
            icon: 'pi pi-question-circle',
            label: 'Question',
            path: '/question',
          },
        ];

  return (
    <div className="custom-sidebar-container">
      <Toast ref={toast} />

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
              <a
                className="p-ripple"
                onClick={() =>
                  item.action ? item.action() : navigate(item.path!)
                }
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
                <Ripple />
              </a>
            </div>
          ))}
        </div>

        <div className="sidebar-logout">
          <a className="p-ripple" onClick={handleLogout}>
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
