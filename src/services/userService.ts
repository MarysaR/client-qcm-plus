import api from './api';
import { AppError, AlreadyExistError, TechnicalError, UnknownError, ValidationError } from 'logic-qcm-plus';

export const fetchUsers = async () => {
  const response = await api.get('/users', {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return response.data;
};


export const createUser = async (userData: {
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
  createdAt?: Date;
  roleid?: 2;
},
currentUserRoleId: number ) => {
  //todo: gérer les chemin dans le nouveau dossier créé par Marysa
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...userData,
      currentUserRoleId, // Ajout de currentUserRoleId comme clé-valeur
    }),
  });

//todo: remplacer chiffre magique par http-status
if (response.status === 400) {
    return new ValidationError('Les données fournies sont invalides.');
} else if (response.status === 409) {
  return new AlreadyExistError('Un utilisateur avec cet email existe déjà.');
} else if (response.status === 500) {
  return new TechnicalError('Une erreur interne est survenue.');
} else if (!response.ok) {
  return new UnknownError('Une erreur inconnue est survenue.');
}

return response.json();
};
