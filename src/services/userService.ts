import api from './api';

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
  try {
    const response = await api.post('/users', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    throw error;
  }
};
