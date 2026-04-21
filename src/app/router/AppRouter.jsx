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
          element={signed ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route path="/solicitar-acesso" element={<PcdFormPage />} />

        {/* ROTAS PRIVADAS */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<div style={{ padding: '20px' }}><h2>Bem-vindo ao Painel!</h2></div>}
            />

            {/* ROTA PROTEGIDA POR ROLE */}
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
