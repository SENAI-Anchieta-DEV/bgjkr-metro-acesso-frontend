import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

// Importação dos Layouts e Proteções
import { DashboardLayout } from '../shell/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Importação das Páginas Públicas
import { LandingPage } from '../shell/LandingPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PcdFormPage } from '../../features/usuarios/pages/PcdFormPage';

// Importação das Páginas Privadas
import { GestaoUsuariosPage } from '../../features/usuarios/pages/GestaoUsuariosPage';
import { AgenteFormPage } from '../../features/usuarios/pages/AgenteFormPage';
import { AdminFormPage } from '../../features/usuarios/pages/AdminFormPage';
// (No futuro importarás aqui as páginas de Estações, Validacoes, etc.)

export const AppRouter = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>A carregar sistema...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ======================= ROTAS PÚBLICAS ======================= */}
        {/* A raiz do site agora é a Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Se já estiver logado e for pro /login, redireciona pro dashboard. Se não, mostra o login. */}
        <Route path="/login" element={signed ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        
        {/* Rota pública para o PCD se cadastrar sem precisar de senha */}
        <Route path="/solicitar-acesso" element={<PcdFormPage />} />

        {/* ======================= ROTAS PRIVADAS (Área do Funcionário) ======================= */}
        {/* O DashboardLayout abraça todas as rotas filhas e desenha o Menu Lateral e Topo nelas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Todas estas rotas vão aparecer DENTRO da "content-area" do DashboardLayout */}
          <Route path="dashboard" element={<div style={{padding: '20px'}}><h2>Bem-vindo ao Painel!</h2><p>Escolha uma opção no menu lateral.</p></div>} />
          <Route path="usuarios" element={<GestaoUsuariosPage />} />
          <Route path="usuarios/novo-agente" element={<AgenteFormPage />} />
          <Route path="usuarios/novo-admin" element={<AdminFormPage />} />
          
          {/* Futuras rotas que vamos criar */}
          <Route path="estacoes" element={<div>Página de Estações (Em breve)</div>} />
          <Route path="dispositivos" element={<div>Página de Sensores e Tags (Em breve)</div>} />
          <Route path="validacoes" element={<div>Página de Validações PCD (Em breve)</div>} />
        </Route>

        {/* Rota de segurança (404) - Se digitar algo que não existe, volta pra Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};