import React from 'react';
import { AuthProvider } from '../../features/auth/AuthContext';

// Este arquivo serve para empilhar todos os provedores globais.
// No futuro, se colocarmos um "ThemeProvider" (Modo Escuro), ele entra aqui também.
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};