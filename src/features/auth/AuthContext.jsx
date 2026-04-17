import React, { createContext, useState, useEffect } from 'react';
import { authService } from './services/authService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@MetroAcesso:user');
    const storagedToken = localStorage.getItem('@MetroAcesso:token');
    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  async function signIn(email, senha) {
    // authService.login espera um objeto { email, senha }
    const data = await authService.login({ email, senha });
    const { token, ...userData } = data;
    localStorage.setItem('@MetroAcesso:token', token);
    localStorage.setItem('@MetroAcesso:user', JSON.stringify(userData));
    setUser(userData);
  }

  function signOut() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};