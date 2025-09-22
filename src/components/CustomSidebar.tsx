import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';



const role = 'Stagiaire' || 'Admin'; 

const CustomSidebar: React.FC<{ role: string }> = ({ role }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const menuItems = role === 'Stagiaire'
        ? [
            { icon: 'pi pi-user', label: 'Profil' },
            { icon: 'pi pi-question-circle', label: 'Questionnaires' },
            { icon: 'pi pi-chart-bar', label: 'Statistiques' },
        ]
        : [
            { icon: 'pi pi-user', label: 'Profil' },
            { icon: 'pi pi-users', label: 'Stagiaires' },
            { icon: 'pi pi-question-circle', label: 'Questionnaires' },
        ];

    return (
        <div className="custom-sidebar-container">
            {/* Sidebar réduite */}
                        {isCollapsed && (
                            <div className="collapsed-sidebar" style={{ marginLeft: '0%', width: '4rem', height: '100vh', backgroundColor: '#121C47', zIndex: 1000, position: 'fixed', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <div className="sidebar-header">
                                    <span className="logo">
                                        <img src="src/assets/images/LogoQCM+PremiumSansLabel.PNG" alt="Logo" style={{ width: '100%', height: 'auto' }} />
                                    </span>
                                </div>

                                <i
                                    className="pi pi-align-justify"
                                    onClick={() => setIsCollapsed(false)}
                                    style={{
                                        color: '#E0BF77',
                                        fontSize: '1.8rem',
                                        cursor: 'pointer',
                                        marginTop: '2rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '100%',
                                    }}
                                    title="Ouvrir le menu"
                                ></i>
                            </div>
                        )}
               <Sidebar
                visible={!isCollapsed}
                onHide={() => setIsCollapsed(true)}
                style={{
                    width: '7rem',
                    height: '100vh',
                    backgroundColor: '#121C47',
                    padding: 0,
                    display: 'flex',           
                    flexDirection: 'column',  
                    position: 'fixed',
                    zIndex: 1100,
                }}
                showCloseIcon={false}
                dismissable={false}
                modal={false}
            >
                {/* Header avec logo et bouton retour */}
    <div style={{ alignItems: 'center', padding: 0, margin: '10px', display: 'flex' }}>
            <span className="logo" style={{ display: 'block', width: '100%', padding: 0, margin: 0 }}>
                <img src="src/assets/images/LogoQCM+Premiuim.PNG" alt="Logo" style={{ position: 'absolute', width: '100%', height: 'auto', top: '0', left: '0'}} />
            </span>
            <Button
                icon="pi pi-arrow-left"
                className="p-button-rounded p-button-text p-button-sm"
                onClick={() => setIsCollapsed(true)}
                tooltip="Replier"
                style={{ color: '#E0BF77', marginTop: '25px' }}
            />
        </div>

    {/* Menu centré */}
    <div className="sidebar-menu" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {menuItems.map((item, index) => (
            <div key={index} className="menu-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                <a className="p-ripple flex align-items-center cursor-pointer p-3 text-white" style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <i className={`${item.icon} mr-2`} style={{ fontSize: '25px', color: '#E0BF77', marginBottom: '8px' }}></i>
                    <span style={{ color: '#FFFFFF', fontSize: '10px' }}>{item.label}</span>
                    <Ripple />
                </a>
            </div>
        ))}
    </div>

    {/* Footer tout en bas */}
    <div className="sidebar-footer" style={{ position: 'absolute', bottom: '0' }}>
        <a className="p-ripple flex align-items-center cursor-pointer p-3 text-white">
            <i className="pi pi-sign-out mr-2" style={{ fontSize: '18px'}}></i>
            <span>Logout</span>
            <Ripple />
        </a>
    </div>
</Sidebar>

        </div>
    );
};

export default CustomSidebar;
