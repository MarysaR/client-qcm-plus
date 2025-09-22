import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer
            className="footer"
            style={{
                backgroundColor: '#030303',
                width: '100%',
                height: 'auto',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 10,
                marginBottom: 0,

            }}
        >
            <p style={{ color: '#FFFFFF', fontSize: '10px' }}>
                @ 2025 QCM+ Tous droits réservés.
            </p>
        </footer>
    );
};

export default Footer;