import React, { useRef, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Toast } from 'primereact/toast';
import '../../styles/style.css';
import { useAuth } from '../../context/AuthContext';
import { useSidebarAuth } from '../../hooks/sidebar/useSidebarAuth';
import { useSidebarQuestionNavigation } from '../../hooks/sidebar/useSidebarQuestionNavigation';
import { useSidebarMenu } from '../../hooks/sidebar/useSidebarMenu';

const CustomSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toast = useRef<Toast>(null);

  const { currentQuestionnaireId } = useAuth();
  const { currentUser: user, handleLogout } = useSidebarAuth(toast);
  const { goTo, handleQuestionNavigation } = useSidebarQuestionNavigation(
    currentQuestionnaireId,
    toast
  );
  const { menuItems } = useSidebarMenu(user?.roleId ?? 0, {
    handleQuestionNavigation,
  });

  if (!user) {
    return null;
  }

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
                onClick={() => (item.action ? item.action() : goTo(item.path!))}
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
