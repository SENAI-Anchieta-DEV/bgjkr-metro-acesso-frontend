import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

import { DashboardLayout } from '../shell/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingPage } from '../shell/LandingPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';

// Importações de Usuários
import { 
  GestaoUsuariosPage, 
  AdminFormPage, 
  AgenteFormPage, 
  PcdPublicFormPage, 
  PcdAdminFormPage, 
  PcdDashboardPage, 
  PcdProfilePage 
} from '../../features/usuarios/pages';

// Importações de Validações
import ValidacoesPage from '../../features/validacoes/pages/ValidacoesPage';

// Importações de Estações
import { GestaoEstacoesPage } from '../../features/estacoes/pages/GestaoEstacoesPage';
import { EstacaoFormPage } from '../../features/estacoes/pages/EstacaoFormPage';

// Importações de Tags
import { GestaoTagsPage } from '../../features/tags/pages/GestaoTagsPage';
import { TagFormPage } from '../../features/tags/pages/TagFormPage';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return user.role === 'USUARIO_PCD' ? <Navigate to="/meu-acesso" /> : <Navigate to="/dashboard" />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/solicitar-acesso" element={<PcdPublicFormPage />} />

        {/* Rotas Protegidas (Dashboard) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<HomeRedirect />} />
            
            {/* Perfil PCD */}
            <Route path="/meu-acesso" element={<PcdDashboardPage />} />
            <Route path="/meu-perfil" element={<PcdProfilePage />} />

            {/* Administrativo: Usuários */}
            <Route path="/usuarios" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoUsuariosPage /></ProtectedRoute>} />
            <Route path="/usuarios/novo-agente" element={<ProtectedRoute role="ADMINISTRADOR"><AgenteFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/novo-admin" element={<ProtectedRoute role="ADMINISTRADOR"><AdminFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/novo-pcd" element={<ProtectedRoute role="ADMINISTRADOR"><PcdAdminFormPage /></ProtectedRoute>} />

            {/* Administrativo: Validações */}
            <Route path="/validacoes" element={<ProtectedRoute role="ADMINISTRADOR"><ValidacoesPage /></ProtectedRoute>} />

            {/* Administrativo: Estações */}
            <Route path="/estacoes" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoEstacoesPage /></ProtectedRoute>} />
            <Route path="/estacoes/nova" element={<ProtectedRoute role="ADMINISTRADOR"><EstacaoFormPage /></ProtectedRoute>} />
            <Route path="/estacoes/editar/:codigo" element={<ProtectedRoute role="ADMINISTRADOR"><EstacaoFormPage /></ProtectedRoute>} />

            {/* Administrativo: Tags RFID */}
            <Route path="/tags" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoTagsPage /></ProtectedRoute>} />
            <Route path="/tags/nova" element={<ProtectedRoute role="ADMINISTRADOR"><TagFormPage /></ProtectedRoute>} />
            <Route path="/tags/editar/:codigoTag" element={<ProtectedRoute role="ADMINISTRADOR"><TagFormPage /></ProtectedRoute>} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
