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
  nom: string;
  prenom: string;
  email: string;
  company: string;
  password: string;
}) => {
  try {
    const response = await fetch('http://localhost:5000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    throw error;
  }
};
