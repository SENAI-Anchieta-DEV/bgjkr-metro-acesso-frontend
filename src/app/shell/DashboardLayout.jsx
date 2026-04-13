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

export const DashboardLayout = () => {
  const { user, signOut } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* SIDEBAR ESCURA */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          {/* Pode ser que o teu SVG da logo precise estar branco. Se estiver escuro, 
              o CSS que mandei já tenta clarear a sidebar inteira. */}
          <img src={LogoImg} alt="Metrô Acesso" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <img src={HomeIcon} alt="Home" />
            Home
          </NavLink>
          
          <NavLink to="/controle-acesso" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <img src={ValidarIcon} alt="Controle" />
            Controle de Acesso
          </NavLink>

          <NavLink to="/monitoramento" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <img src={PendenciasIcon} alt="Monitoramento" />
            Monitoramento
          </NavLink>
          
          {user?.role === 'ADMINISTRADOR' && (
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <img src={UsersIcon} alt="Usuários" />
              Gestão de Usuários
            </NavLink>
          )}

          <NavLink to="/validacoes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <img src={ValidarIcon} alt="Validações PCD" />
            Validações PCD
          </NavLink>

          <NavLink to="/relatorios" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <img src={PendenciasIcon} alt="Relatórios" />
            Relatórios
          </NavLink>
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
                <span className="user-name">{user?.nome || 'Admin Master'}</span>
                <span className="user-role">
                  {user?.role === 'ADMINISTRADOR' ? 'Administrador' : 'Agente'}
                </span>
              </div>
              <div className="avatar">
                {getInitials(user?.nome || 'Admin')}
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