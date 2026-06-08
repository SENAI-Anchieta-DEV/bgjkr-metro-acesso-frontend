import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { pendenciasService } from '../../features/usuarios/services/pendenciasService';
import './DashboardLayout.css';

import LogoImg from '../../assets/logo.svg';
import HomeIcon from '../../assets/Home.svg';
import UsersIcon from '../../assets/listaUSer.svg';
import ValidarIcon from '../../assets/Validar.svg';
import PendenciasIcon from '../../assets/Pendencias.svg';
import SairIcon from '../../assets/sair.svg';

const SidebarLink = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
    <img src={icon} alt={label} />
    {label}
  </NavLink>
);

export const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notificacao, setNotificacao] = useState(null);
  const contagemAnterior = useRef(null);

  useEffect(() => {
    if (user?.role !== 'AGENTE_ATENDIMENTO' || !user?.email) return;

    const verificar = async () => {
      try {
        const dados = await pendenciasService.listarPendenciasDoAgente(user.email);
        const total = dados.length;

        if (contagemAnterior.current === null) {
          contagemAnterior.current = total;
          return;
        }

        if (total > contagemAnterior.current) {
          const nova = dados[dados.length - 1];
          setNotificacao({
            nomePcd: nova?.pcdAtendido?.nome ?? 'Passageiro PCD',
            nomeEstacao: nova?.estacao?.nome ?? '—',
          });
          window.dispatchEvent(new CustomEvent('nova-pendencia'));
        }

        contagemAnterior.current = total;
      } catch {
        // silencioso
      }
    };

    verificar();
    const interval = setInterval(verificar, 5000);
    return () => clearInterval(interval);
  }, [user?.role, user?.email]);

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={LogoImg} alt="Logo" />
        </div>

        <nav className="sidebar-nav">

          {/* Menu Administrativo */}
          {user?.role === 'ADMINISTRADOR' && (
            <>
              <SidebarLink to="/dashboard" icon={HomeIcon} label="Início" />
              <SidebarLink to="/usuarios" icon={UsersIcon} label="Usuários" />
              <SidebarLink to="/validacoes" icon={ValidarIcon} label="Validações" />
              <SidebarLink to="/estacoes" icon={PendenciasIcon} label="Estações" />
              <SidebarLink to="/tags" icon={PendenciasIcon} label="Tags RFID" />
            </>
          )}

          {/* Menu Agente */}
          {user?.role === 'AGENTE_ATENDIMENTO' && (
            <>
              <SidebarLink to="/agente/dashboard" icon={HomeIcon} label="Dashboard" />
              <SidebarLink to="/agente/pendencias" icon={PendenciasIcon} label="Pendências" />
              <SidebarLink to="/agente/alertas" icon={ValidarIcon} label="Alertas da Estação" />
            </>
          )}

          {/* Menu PCD */}
          {user?.role === 'USUARIO_PCD' && (
            <>
              <SidebarLink to="/meu-acesso" icon={HomeIcon} label="Meu Status" />
              <SidebarLink to="/meu-perfil" icon={UsersIcon} label="Meu Perfil" />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-sair" onClick={signOut}>
            <img src={SairIcon} alt="Sair" />
            Sair
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <input className="search-input" placeholder="Pesquisar..." />
          <div className="topbar-actions">
            <div className="avatar">
              {user?.nome?.[0] || 'U'}
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>

      {notificacao && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: 9999,
          background: '#EF4444',
          color: 'white',
          padding: '1.5rem 2rem',
          boxShadow: '0 -8px 40px rgba(239,68,68,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderTop: '6px solid #B91C1C',
          animation: 'slideUp 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2.5rem' }}>⚠️</span>
            <div>
              <strong style={{ fontSize: '1.3rem', display: 'block' }}>
                Nova Pendência de Atendimento!
              </strong>
              <span style={{ fontSize: '1.05rem', opacity: 0.95 }}>
                <strong>{notificacao.nomePcd ?? 'Passageiro PCD'}</strong> entrou na estação <strong>{notificacao.nomeEstacao ?? '—'}</strong> e precisa de atendimento.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { navigate('/agente/pendencias'); setNotificacao(null); }}
              style={{
                flex: 1, background: 'white', color: '#EF4444',
                border: 'none', borderRadius: '8px', padding: '14px',
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              }}
            >
              Ver pendências agora
            </button>
            <button
              onClick={() => setNotificacao(null)}
              style={{
                background: 'transparent', color: 'white',
                border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px',
                padding: '14px 20px', cursor: 'pointer', fontSize: '1rem',
              }}
            >
              Dispensar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};