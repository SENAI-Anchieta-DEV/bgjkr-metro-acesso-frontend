import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { usuariosService } from '../../usuarios/services/usuariosService';
import './AdminDashboardPage.css';

// ─── Card de atalho para outras páginas ───────────────────────────────────────
const NavCard = ({ titulo, descricao, icone, rota, cor, badge }) => {
  const navigate = useNavigate();
  return (
    <div
      className="nav-card"
      onClick={() => navigate(rota)}
      style={{ '--card-accent': cor }}
    >
      <div className="nav-card-icon" style={{ background: `${cor}22`, color: cor }}>
        {icone}
      </div>
      <div className="nav-card-body">
        <div className="nav-card-title-row">
          <h3>{titulo}</h3>
          {badge != null && <span className="nav-card-badge">{badge}</span>}
        </div>
        <p>{descricao}</p>
      </div>
      <svg className="nav-card-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

// ─── Card de stat ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, cor, loading }) => (
  <div className="dash-stat-card">
    <span className="dash-stat-label">{label}</span>
    <div className="dash-stat-value" style={{ color: cor ?? 'var(--cor-primaria)' }}>
      {loading ? <span className="stat-skeleton" /> : value}
    </div>
    {sub && <span className="dash-stat-sub">{sub}</span>}
  </div>
);

// ─── Componente principal ──────────────────────────────────────────────────────
export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ admins: 0, agentes: 0, pcds: 0 });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [hora, setHora] = useState(new Date());

  // Atualiza relógio a cada minuto
  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const carregarStats = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [admins, agentes, pcds] = await Promise.all([
        usuariosService.listarAdmins(),
        usuariosService.listarAgentes(),
        usuariosService.listarPcds(),
      ]);
      setStats({ admins: admins.length, agentes: agentes.length, pcds: pcds.length });
    } catch {
      setErro('Não foi possível carregar os dados do painel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarStats(); }, [carregarStats]);

  const saudacao = () => {
    const h = hora.getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const dataFormatada = hora.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="admin-dash-container">

      {/* ── Cabeçalho de boas-vindas ── */}
      <div className="admin-dash-header">
        <div className="admin-dash-header-text">
          <h1>{saudacao()}, {user?.nome?.split(' ')[0] ?? 'Administrador'} 👋</h1>
          <p>{dataFormatada}</p>
        </div>
        <button className="btn-refresh" onClick={carregarStats} title="Atualizar dados">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {/* ── Erro ── */}
      {erro && (
        <div className="admin-dash-error">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {erro}
          <button onClick={carregarStats}>Tentar novamente</button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="admin-dash-stats">
        <StatCard
          label="Total de Usuários"
          value={stats.admins + stats.agentes + stats.pcds}
          sub="no sistema"
          loading={loading}
        />
        <StatCard
          label="Administradores"
          value={stats.admins}
          sub="com acesso total"
          cor="#ffffff"
          loading={loading}
        />
        <StatCard
          label="Agentes Ativos"
          value={stats.agentes}
          sub="em atendimento"
          cor="#009CDE"
          loading={loading}
        />
        <StatCard
          label="Usuários PcD"
          value={stats.pcds}
          sub="cadastrados"
          cor="#0BB07B"
          loading={loading}
        />
      </div>

      {/* ── Seção de navegação ── */}
      <div className="admin-dash-section-title">
        <span>Módulos do Sistema</span>
        <div className="section-divider" />
      </div>

      <div className="admin-dash-nav-grid">
        <NavCard
          titulo="Gestão de Usuários"
          descricao="Cadastre, edite e remova Administradores, Agentes de Atendimento e Usuários PcD."
          icone={
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          rota="/usuarios"
          cor="#009CDE"
          badge={loading ? '…' : stats.admins + stats.agentes + stats.pcds}
        />

        <NavCard
          titulo="Validações"
          descricao="Gerencie e visualize os registros de validação de acesso PcD nas estações."
          icone={
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          rota="/validacoes"
          cor="#0BB07B"
        />

        <NavCard
          titulo="Estações"
          descricao="Cadastre e configure as estações do metrô e vincule agentes de atendimento."
          icone={
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          rota="/estacoes"
          cor="#F59E0B"
        />

        <NavCard
          titulo="Tags"
          descricao="Gerencie as tags associadas aos usuários PcD para controle de acesso."
          icone={
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
          rota="/tags"
          cor="#A855F7"
        />
      </div>

      {/* ── Rodapé informativo ── */}
      <div className="admin-dash-footer">
        <div className="footer-status">
          <span className="status-dot online" />
          <span>Sistema Online</span>
        </div>
        <span>Metro Acesso · Painel Administrativo</span>
      </div>

    </div>
  );
};