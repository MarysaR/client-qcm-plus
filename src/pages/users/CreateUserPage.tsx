import React from 'react';
import '../../styles/style.css';

const CreateUserPage: React.FC = () => {
    return (
        <div className="create-user-page">
            {/* Image de fond */}
            <img
                src="src/assets/images/fond.png"
                alt="Background"
                className="background-image"
            />
            {/* Logo en haut à droite */}
            <img
                src="src/assets/images/LogoQCM+SansLabelSansFond.png"
                alt="Logo"
                className="logo-top-right"
            />

            {/* Titre en haut à gauche */}
            <h1 className="page-title">Nouveau Stagiaire</h1>

            {/* Formulaire au centre */}
            <div className="form-container">
                <form className="user-form">
                <div className="form-group">
                        <label>Photo</label>
                            <img src='' alt='' />
                        </div>
                    <div className="form-group">
                        <label htmlFor="login">Login</label>
                        <input type="text" id="login" name="login" placeholder="Entrez le login" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom" name="nom" placeholder="Entrez le nom" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prenom">Prénom</label>
                        <input type="text" id="prenom" name="prenom" placeholder="Entrez le prénom" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Entrez l'email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" name="password" placeholder="Entrez le mot de passe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirmer mot de passe</label>
                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirmez le mot de passe" />
                    </div>
                    <button type="submit" className="create-button">Créer</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserPage;