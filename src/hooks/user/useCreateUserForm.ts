import React, { useState } from 'react';
import { createUser } from '../../services/user/userService';
import {
  ValidationError,
  AlreadyExistError,
  TechnicalError,
  UnknownError,
  PermissionDeniedError,
} from 'logic-qcm-plus';
import { CreateUserTypes } from 'src/types/createUserTypes';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCreateUserForm() {
  const [login, setLogin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

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
    e.preventDefault();

    if (validateForm()) {
      const userData: CreateUserTypes = {
        login,
        firstName,
        lastName,
        email,
        company,
        password,
      };

      const result = await createUser(userData);

      if (!(result instanceof Error) && result.isOk) {
        toast.current?.show({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur créé avec succès !',
        });

        setLogin('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setCompany('');
        setConfirmPassword('');
        setErrors([]);

        navigate(`/users`);
      } else {
        const error =
          result instanceof Error ? result : new UnknownError(result.message);

        switch (true) {
          case error instanceof ValidationError:
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur de validation',
              detail: error.message,
            });
            break;

          case error instanceof AlreadyExistError:
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur',
              detail: error.message,
            });
            break;

          case error instanceof TechnicalError:
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur technique',
              detail: error.message,
            });
            break;

          case error instanceof PermissionDeniedError:
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur',
              detail: `Permission refusée : ${error.message}`,
            });
            break;

          case error instanceof UnknownError:
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur inconnue',
              detail: error.message,
            });
            break;

          default:
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Une erreur inattendue est survenue.',
            });
            break;
        }
      }
    }
  };

  return {
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
  };
}
