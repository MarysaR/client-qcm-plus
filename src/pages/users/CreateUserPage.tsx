import React, { useState } from 'react';
import '../../styles/style.css';
import { createUser } from '../../services/userService';

const CreateUserPage: React.FC = () => {
    const [login, setLogin] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<string[]>([]);

    const validateForm = () => {
        const newErrors: string[] = [];

        if (!login) newErrors.push('Le champ "Login" est requis.');
        if (!nom) newErrors.push('Le champ "Nom" est requis.');
        if (!prenom) newErrors.push('Le champ "Prénom" est requis.');
        if (!email) newErrors.push('Le champ "Email" est requis.');
        if (!company) newErrors.push('Le champ "Entreprise" est requis.');
        if (!password) newErrors.push('Le champ "Mot de passe" est requis.');
        if (!confirmPassword) newErrors.push('Le champ "Confirmer mot de passe" est requis.');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            newErrors.push('L\'email n\'est pas valide.');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password && !passwordRegex.test(password)) {
            newErrors.push('Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.');
        }

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.push('Les mots de passe ne correspondent pas.');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 

        if (validateForm()) {

            const userData = { login, nom, prenom, email, company, password };
            const response = createUser(userData);
            console.log('Utilisateur créé avec succès :', response);
            alert({response});

            setLogin('');
            setNom('');
            setPrenom('');
            setEmail('');
            setPassword('');
            setCompany('');
            setConfirmPassword('');
            setErrors([]);
        }
    };

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
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Photo</label>
                        <img src='' alt='' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login">Login</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            placeholder="Entrez le login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            placeholder="Entrez le nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prenom">Prénom</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            placeholder="Entrez le prénom"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Entrez l'email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Entrez le mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirmer mot de passe</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            placeholder="Confirmez le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="create-button">Créer</button>
                </form>

                {/* Affichage des erreurs */}
                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index} className="error-text">{error}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateUserPage;