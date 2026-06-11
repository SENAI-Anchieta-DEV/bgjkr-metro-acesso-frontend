import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

import { DashboardLayout } from '../shell/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingPage } from '../shell/LandingPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { EntradaFormPage } from '../../features/estacoes/pages/EntradaFormPage';

// Importações de Usuários
import {
  GestaoUsuariosPage,
  AdminFormPage,
  AdminDashboardPage,
  AgenteFormPage,
  PcdPublicFormPage,
  PcdAdminFormPage,
  PcdDashboardPage,
  PcdProfilePage,
  AgenteDashboardPage,
  AgentePendenciasPage,
  AgenteAlertasPage,
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
  if (user.role === 'USUARIO_PCD') return <Navigate to="/meu-acesso" />;
  if (user.role === 'AGENTE_ATENDIMENTO') return <Navigate to="/agente/dashboard" />;
  if (user.role === 'ADMINISTRADOR') return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/dashboard" />;
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

            {/* Agente */}
            <Route path="/agente/dashboard" element={<ProtectedRoute role="AGENTE_ATENDIMENTO"><AgenteDashboardPage /></ProtectedRoute>} />
            <Route path="/agente/pendencias" element={<ProtectedRoute role="AGENTE_ATENDIMENTO"><AgentePendenciasPage /></ProtectedRoute>} />
            <Route path="/agente/alertas" element={<ProtectedRoute role="AGENTE_ATENDIMENTO"><AgenteAlertasPage /></ProtectedRoute>} />

            {/* Administrativo: Dashboard */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMINISTRADOR"><AdminDashboardPage /></ProtectedRoute>} />

            {/* Administrativo: Usuários */}
            <Route path="/usuarios" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoUsuariosPage /></ProtectedRoute>} />
            <Route path="/usuarios/novo-agente" element={<ProtectedRoute role="ADMINISTRADOR"><AgenteFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/novo-admin" element={<ProtectedRoute role="ADMINISTRADOR"><AdminFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/novo-pcd" element={<ProtectedRoute role="ADMINISTRADOR"><PcdAdminFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/editar-admin/:email" element={<ProtectedRoute role="ADMINISTRADOR"><AdminFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/editar-agente/:email" element={<ProtectedRoute role="ADMINISTRADOR"><AgenteFormPage /></ProtectedRoute>} />
            <Route path="/usuarios/editar-pcd/:email" element={<ProtectedRoute role="ADMINISTRADOR"><PcdAdminFormPage /></ProtectedRoute>} />

            {/* Administrativo: Validações */}
            <Route path="/validacoes" element={<ProtectedRoute role="ADMINISTRADOR"><ValidacoesPage /></ProtectedRoute>} />

            {/* Administrativo: Estações */}
            <Route path="/estacoes" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoEstacoesPage /></ProtectedRoute>} />
            <Route path="/estacoes/nova" element={<ProtectedRoute role="ADMINISTRADOR"><EstacaoFormPage /></ProtectedRoute>} />
            <Route path="/estacoes/editar/:codigo" element={<ProtectedRoute role="ADMINISTRADOR"><EstacaoFormPage /></ProtectedRoute>} />

            <Route path="/estacoes/:codigoEstacao/entradas/nova" element={<ProtectedRoute role="ADMINISTRADOR"><EntradaFormPage /></ProtectedRoute>} />
            <Route path="/estacoes/:codigoEstacao/entradas/editar/:codigoEntrada" element={<ProtectedRoute role="ADMINISTRADOR"><EntradaFormPage /></ProtectedRoute>} />

            {/* Administrativo: Tags */}
            <Route path="/tags" element={<ProtectedRoute role="ADMINISTRADOR"><GestaoTagsPage /></ProtectedRoute>} />
            <Route path="/tags/nova" element={<ProtectedRoute role="ADMINISTRADOR"><TagFormPage /></ProtectedRoute>} />
            <Route path="/tags/editar/:codigoTag" element={<ProtectedRoute role="ADMINISTRADOR"><TagFormPage /></ProtectedRoute>} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};