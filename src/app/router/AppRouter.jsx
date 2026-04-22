import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

import { DashboardLayout } from '../shell/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingPage } from '../shell/LandingPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PcdFormPage } from '../../features/usuarios/pages/PcdFormPage';
import { GestaoUsuariosPage } from '../../features/usuarios/pages/GestaoUsuariosPage';
import { AgenteFormPage } from '../../features/usuarios/pages/AgenteFormPage';
import { AdminFormPage } from '../../features/usuarios/pages/AdminFormPage';
import { PcdDashboardPage } from '../../features/usuarios/pages/PcdDashboardPage';
import { PcdProfilePage } from '../../features/usuarios/pages/PcdProfilePage';
import ValidacoesPage from '../../features/validacoes/pages/ValidacoesPage';

// Redireciona para a página certa conforme a role do usuário logado
const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'USUARIO_PCD') return <Navigate to="/meu-acesso" replace />;
  return <Navigate to="/dashboard" replace />;
};

export const AppRouter = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>A carregar sistema...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={signed ? <HomeRedirect /> : <LoginPage />}
        />
        <Route path="/solicitar-acesso" element={<PcdFormPage />} />

        {/* ROTAS PRIVADAS — qualquer utilizador autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Dashboard padrão (admin / agente) */}
            <Route
              path="/dashboard"
              element={<div style={{ padding: '20px' }}><h2>Bem-vindo ao Painel!</h2></div>}
            />

            {/* Dashboard do PCD (role USUARIO_PCD) */}
            <Route
              path="/meu-acesso"
              element={
                <ProtectedRoute role="USUARIO_PCD">
                  <PcdDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Perfil do PCD */}
            <Route
              path="/meu-perfil"
              element={
                <ProtectedRoute role="USUARIO_PCD">
                  <PcdProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Validações (admin / agente) */}
            <Route
              path="/validacoes"
              element={
                <ProtectedRoute role="ADMINISTRADOR">
                  <ValidacoesPage />
                </ProtectedRoute>
              }
            />

            {/* Gestão de usuários (somente admin) */}
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute role="ADMINISTRADOR">
                  <GestaoUsuariosPage />
                </ProtectedRoute>
              }
            />
            <Route path="/usuarios/novo-agente" element={<AgenteFormPage />} />
            <Route path="/usuarios/novo-admin" element={<AdminFormPage />} />

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};