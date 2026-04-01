import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Este é um Hook customizado. 
// Nas telas, só precisaremos digitar: const { signIn, signOut, user } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};