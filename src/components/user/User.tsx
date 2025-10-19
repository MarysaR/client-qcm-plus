import React, { useMemo } from 'react';
import '../../styles/style.css';
import { Toast } from 'primereact/toast';
import { useCreateUserForm } from '../../hooks/user/useCreateUserForm';

const User: React.FC = () => {
  const {
    login,
    setLogin,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    company,
    setCompany,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    toast,
    handleSubmit,
  } = useCreateUserForm();

  const randomAvatar = useMemo(() => {
    const index = Math.floor(Math.random() * 3) + 1;
    return `src/assets/avatars/avatar${index}.PNG`;
  }, []);

  return (
    <div className="create-user-page">
      <Toast ref={toast} />
      <img
        src="src/assets/images/fond.png"
        alt="Background"
        className="background-image"
      />
      <img
        src="src/assets/images/LogoQCM+SansLabelSansFond.png"
        alt="Logo"
        className="logo-top-right"
      />
      <h1 className="page-title">Nouveau Stagiaire</h1>
      <div className="form-container">
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <img src={randomAvatar} alt="Avatar" className="avatar-preview" />
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

export default User;
