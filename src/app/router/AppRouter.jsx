import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Importação via Barrel (Apontando apenas para a pasta)
import { DashboardLayout } from '../shell';
import { LoginPage } from '../../features/auth/pages';
import { ValidacoesPage } from '../../features/validacoes/pages';
import { 
  GestaoUsuariosPage, 
  AdminFormPage, 
  AgenteFormPage, 
  PcdFormPage 
} from '../../features/usuarios/pages';

/**
 * AppRouter - Versão com Barrel Strategy
 * Note como os imports acima ficaram organizados por domínio.
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Protegidas (JWT obrigatório) */}
      <Route element={<ProtectedRoute />}>
        {/* O DashboardLayout envolve as páginas internas */}
        <Route element={<DashboardLayout />}>
          
          {/* Fila de Validações (Home do Admin) */}
          <Route path="/admin" element={<ValidacoesPage />} />
          
          {/* Módulo de Gestão de Usuários */}
          <Route path="/usuarios" element={<GestaoUsuariosPage />} />
          <Route path="/usuarios/novo-admin" element={<AdminFormPage />} />
          <Route path="/usuarios/novo-agente" element={<AgenteFormPage />} />
          <Route path="/usuarios/novo-pcd" element={<PcdFormPage />} />

        </Route>
      </Route>

      {/* Redirecionamento Padrão */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};