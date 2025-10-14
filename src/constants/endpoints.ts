const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const LOGIN = `${API_URL}/auth/login`;
export const ME = `${API_URL}/auth/me`;
export const LOGOUT = `${API_URL}/auth/logout`;
export const CREATE_QUESTION = `${API_URL}/questions`;
export const USERS = `${API_URL}/users`;
