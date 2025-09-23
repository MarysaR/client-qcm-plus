import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  AuthContextType,
  AuthUser,
  LoginCredentials,
} from '../../types/auth';
import {
  loginMock,
  loadSession,
  clearSession,
} from '../services/auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = loadSession();
    if (existing) setUser(existing);
    setLoading(false);
  }, []);

  async function login(creds: LoginCredentials) {
    setError(null);
    try {
      const u = await loginMock(creds);
      setUser(u);
    } catch {
      setError('Identifiants invalides');
      throw new Error('INVALID_CREDENTIALS');
    }
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
