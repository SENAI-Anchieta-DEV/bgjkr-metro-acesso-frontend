import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

import { DashboardLayout } from '../shell/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingPage } from '../shell/LandingPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PcdPublicFormPage } from '../../features/usuarios/pages/PcdPublicFormPage';
import { PcdAdminFormPage } from '../../features/usuarios/pages/PcdAdminFormPage';
import { GestaoUsuariosPage } from '../../features/usuarios/pages/GestaoUsuariosPage';
import { AgenteFormPage } from '../../features/usuarios/pages/AgenteFormPage';
import { AdminFormPage } from '../../features/usuarios/pages/AdminFormPage';
import { PcdDashboardPage } from '../../features/usuarios/pages/PcdDashboardPage';
import { PcdProfilePage } from '../../features/usuarios/pages/PcdProfilePage';
import ValidacoesPage from '../../features/validacoes/pages/ValidacoesPage';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'USUARIO_PCD') return <Navigate to="/meu-acesso" replace />;
  return <Navigate to="/dashboard" replace />;
};

export const AppRouter = () => {
  const { signed, loading } = useAuth();

  if (loading) return <div>A carregar sistema...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTA PÚBLICA - AUTOATENDIMENTO */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={signed ? <HomeRedirect /> : <LoginPage />} />
        <Route path="/solicitar-acesso" element={<PcdPublicFormPage />} />

        {/* ROTAS PRIVADAS */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<h2>Bem-vindo ao Painel!</h2>} />
            <Route path="/meu-acesso" element={<ProtectedRoute role="USUARIO_PCD"><PcdDashboardPage /></ProtectedRoute>} />
            <Route path="/meu-perfil" element={<ProtectedRoute role="USUARIO_PCD"><PcdProfilePage /></ProtectedRoute>} />
            <Route path="/validacoes" element={<ProtectedRoute role="ADMINISTRADOR"><ValidacoesPage /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoUsuariosPage /></ProtectedRoute>} />
            
            <Route path="/usuarios/novo-agente" element={<AgenteFormPage />} />
            <Route path="/usuarios/novo-admin" element={<AdminFormPage />} />
            
            {/* NOVA ROTA PRIVADA PARA ADMIN CADASTRAR PCD */}
            <Route path="/usuarios/novo-pcd" element={
              <ProtectedRoute role="ADMINISTRADOR">
                <PcdAdminFormPage />
              </ProtectedRoute>
            } />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
