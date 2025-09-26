import React, { createContext, useContext, useState } from 'react';

import { TokenClaims } from 'logic-qcm-plus';
import { AuthContextType } from 'src/components/utils/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<TokenClaims | null>(null);

  async function login(token: string, claims: TokenClaims) {
    setToken(token);
    setClaims(claims);

    localStorage.setItem('authToken', token);
    localStorage.setItem('authClaims', JSON.stringify(claims));
  }

  function logout() {
    setToken(null);
    setClaims(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authClaims');
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        claims,
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
