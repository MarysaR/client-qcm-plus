import api from './api';
import { AppError, ValidationError, AlreadyExistError, TechnicalError, UnknownError } from 'logic-qcm-plus';

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
}) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
});

if (response.status === 400) {
    throw new ValidationError('Les données fournies sont invalides.');
} else if (response.status === 409) {
    throw new AlreadyExistError('Un utilisateur avec cet email existe déjà.');
} else if (response.status === 500) {
    throw new TechnicalError('Une erreur interne est survenue.');
} else if (!response.ok) {
    throw new UnknownError('Une erreur inconnue est survenue.');
}

return response.json();
};
