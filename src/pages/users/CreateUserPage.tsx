import React, { useState } from 'react';
import '../../styles/style.css';
import { createUser } from '../../services/userService';
import {
  AppError,
  ValidationError,
  AlreadyExistError,
  TechnicalError,
  UnknownError,
  PermissionDeniedError,
} from 'logic-qcm-plus';
import { TOKEN_KEY } from '../../constants/storage';

const CreateUserPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!login) newErrors.push('Le champ "Login" est requis.');
    if (!firstName) newErrors.push('Le champ "Nom" est requis.');
    if (!lastName) newErrors.push('Le champ "Prénom" est requis.');
    if (!email) newErrors.push('Le champ "Email" est requis.');
    if (!company) newErrors.push('Le champ "Entreprise" est requis.');
    if (!password) newErrors.push('Le champ "Mot de passe" est requis.');
    if (!confirmPassword)
      newErrors.push('Le champ "Confirmer mot de passe" est requis.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.push("L'email n'est pas valide.");
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.push(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.'
      );
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push('Les mots de passe ne correspondent pas.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem(TOKEN_KEY);
    let payload = null;

    if (token) {
      payload = JSON.parse(atob(token.split('.')[1]));
    } else {
      alert('Token non trouvé. Veuillez vous reconnecter.');
      return new PermissionDeniedError(
        'Token non trouvé. Veuillez vous reconnecter.'
      );
    }

    const currentUserRoleId = payload.roleId;

    console.log('Current User Role ID:', currentUserRoleId);

    if (currentUserRoleId != 1 || currentUserRoleId == null) {
      alert("Vous n'avez pas la permission de créer un utilisateur.");
      return new PermissionDeniedError(
        "Vous n'avez pas la permission de créer un utilisateur."
      );
    }

    e.preventDefault();

    if (validateForm()) {
      const userData = { login, firstName, lastName, email, company, password };

      createUser(userData, currentUserRoleId)
        .then((response) => {
          console.log('Utilisateur créé avec succès :', response);
          alert('Utilisateur créé avec succès !');

          // Réinitialiser les champs
          setLogin('');
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setCompany('');
          setConfirmPassword('');
          setErrors([]);
        })
        .catch((error: AppError) => {
          // Gérer les erreurs personnalisées
          if (error instanceof ValidationError) {
            alert(`Erreur de validation : ${error.message}`);
          } else if (error instanceof AlreadyExistError) {
            alert(`Erreur : ${error.message}`);
          } else if (error instanceof TechnicalError) {
            alert(`Erreur technique : ${error.message}`);
          } else if (error instanceof UnknownError) {
            alert(`Erreur inconnue : ${error.message}`);
          } else {
            alert('Une erreur inattendue est survenue.');
          }

          console.error("Erreur lors de la création de l'utilisateur :", error);
        });
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
            <img src="" alt="" />
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
            <label htmlFor="firstName">Nom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Entrez le nom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Prénom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Entrez le prénom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Compagnie</label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Entrez la compagnie"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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
          <button type="submit" className="create-button">
            Créer
          </button>
        </form>

        {/* Affichage des erreurs */}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-text">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUserPage;
