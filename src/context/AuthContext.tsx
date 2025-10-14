// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppError, Result } from 'logic-qcm-plus';
import { AuthContextType } from '../types/AuthContextType';
import { authService } from '../services/auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [currentQuestionnaireId, setCurrentQuestionnaireId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    authService.me().then((res) => {
      if (res.isOk()) {
        setUser(res.value);
      } else {
        authService.clearToken();
      }
    });
  }, []);

  async function login(
    email: string,
    password: string
  ): Promise<Result<void, AppError>> {
    const result = await authService.login({ email, password });
    if (result.isOk()) {
      const meResult = await authService.me();
      if (meResult.isOk()) {
        setUser(meResult.value);
      }
    }

    return result;
  }

  async function logout(): Promise<Result<void, AppError>> {
    const result = await authService.logout();
    if (result.isOk()) {
      setUser(null);
      setCurrentQuestionnaireId(null);
    }

    return result;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        currentQuestionnaireId,
        setCurrentQuestionnaireId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
