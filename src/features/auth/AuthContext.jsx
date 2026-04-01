import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../../features/auth/services/authService';

// Cria o contexto
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assim que o site abre, ele verifica se já existe um token salvo de uma visita anterior
  useEffect(() => {
    const token = localStorage.getItem('@MetroAcesso:token');
    const role = localStorage.getItem('@MetroAcesso:role');

    if (token) {
      // Se tem token, avisa o sistema que estamos logados
      setUser({ token, role });
    }
    
    setLoading(false); // Terminou de verificar
  }, []);

  // Função que a tela de Login vai chamar
  const signIn = async (email, senha) => {
    try {
      const data = await authService.login({ email, senha });
      
      // Atualiza a "nuvem" dizendo quem acabou de entrar
      setUser({
        token: data.token,
        role: data.role // Admin, Agente, etc.
      });
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Função que o botão "Sair" vai chamar
  const signOut = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};