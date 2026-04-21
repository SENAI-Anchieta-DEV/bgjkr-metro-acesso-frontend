import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import './DashboardLayout.css';

// Ícones
import LogoImg from '../../assets/logo.svg';
import HomeIcon from '../../assets/Home.svg';
import UsersIcon from '../../assets/listaUSer.svg';
import ValidarIcon from '../../assets/Validar.svg';
import PendenciasIcon from '../../assets/Pendencias.svg';
import SairIcon from '../../assets/sair.svg';
import BellIcon from '../../assets/TopAction/Bell.svg';
import ChatIcon from '../../assets/TopAction/Chat.svg';

const SidebarLink = React.memo(({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive ? "nav-item active" : "nav-item"
    }
  >
    <img src={icon} alt={label} />
    {label}
  </NavLink>
));

export const DashboardLayout = () => {
  const { user, signOut } = useAuth();

  const getInitials = (nome) => {
    if (!nome) return 'A';
    return nome.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard-wrapper">

      {/* SIDEBAR ESCURA */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={LogoImg} alt="Metrô Acesso" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>

        <nav className="sidebar-nav">
          <SidebarLink to="/dashboard" icon={HomeIcon} label="Início" />
          {user?.role === 'ADMINISTRADOR' && (
            <>
              <SidebarLink to="/usuarios" icon={UsersIcon} label="Gestão de Usuários" />
              <SidebarLink to="/validacoes" icon={ValidarIcon} label="Validações PCD" />
            </>
          )}
          {user?.role === 'AGENTE_ATENDIMENTO' && (
            <SidebarLink to="/atendimento" icon={PendenciasIcon} label="Atendimento" />
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-sair" onClick={signOut}>
            <img src={SairIcon} alt="Sair" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA CENTRAL */}
      <main className="main-area">

        {/* TOPBAR COM PESQUISA */}
        <header className="topbar">
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Pesquisar..." />
          </div>

          <div className="topbar-actions">
            <div className="action-icons">
              <button className="action-btn">
                <img src={ChatIcon} alt="Mensagens" />
              </button>
              <button className="action-btn">
                <img src={BellIcon} alt="Notificações" />
                <span className="notification-dot"></span>
              </button>
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user?.nome || 'Usuário'}</span>
                <span className="user-role">
                  {user?.role === 'ADMINISTRADOR' 
                    ? 'Administrador' 
                    : user?.role === 'AGENTE_ATENDIMENTO'
                    ? 'Agente'
                    : 'PCD'}
                </span>
              </div>
              <div className="avatar">
                {getInitials(user?.nome || 'Usuário')}
              </div>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>

    </div>
  );
};