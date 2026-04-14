import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

import { DashboardLayout } from '../shell/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LandingPage } from '../shell/LandingPage';
// CORREÇÃO 1: Adicionadas as chavetas {} nos imports abaixo
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PcdFormPage } from '../../features/usuarios/pages/PcdFormPage';

import { GestaoUsuariosPage } from '../../features/usuarios/pages/GestaoUsuariosPage';
import { AgenteFormPage } from '../../features/usuarios/pages/AgenteFormPage';
import { AdminFormPage } from '../../features/usuarios/pages/AdminFormPage';

export const AppRouter = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        A carregar sistema...
      </div>
    );
  }

  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={signed ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route path="/solicitar-acesso" element={<PcdFormPage />} />

      {/* ROTAS PRIVADAS */}
      {/* CORREÇÃO 2: Estrutura alinhada com o uso do <Outlet /> */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <div style={{ padding: '20px' }}>
                <h2>Bem-vindo ao Painel!</h2>
                <p>Escolha uma opção no menu lateral.</p>
              </div>
            }
          />
          <Route path="/usuarios" element={<GestaoUsuariosPage />} />
          <Route path="/usuarios/novo-agente" element={<AgenteFormPage />} />
          <Route path="/usuarios/novo-admin" element={<AdminFormPage />} />
          <Route path="/estacoes" element={<div>Página de Estações (Em breve)</div>} />
          <Route path="/dispositivos" element={<div>Página de Sensores e Tags (Em breve)</div>} />
          <Route path="/validacoes" element={<div>Página de Validações PCD (Em breve)</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};