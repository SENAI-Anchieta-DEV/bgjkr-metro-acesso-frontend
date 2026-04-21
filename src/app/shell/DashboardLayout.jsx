import React, { useState } from 'react';
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

const SidebarLink = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
    <img src={icon} alt={label} />
    {label}
  </NavLink>
);

export const DashboardLayout = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard-wrapper">

      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={LogoImg} alt="Logo" />
        </div>

        <nav className="sidebar-nav">
          <SidebarLink to="/dashboard" icon={HomeIcon} label="Início" />
          <SidebarLink to="/usuarios" icon={UsersIcon} label="Usuários" />
          <SidebarLink to="/validacoes" icon={ValidarIcon} label="Validações" />
          <SidebarLink to="/pendencias" icon={PendenciasIcon} label="Pendências" />
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
            <button className="action-btn">
              <img src={ChatIcon} />
            </button>

            <button className="action-btn">
              <img src={BellIcon} />
              <span className="notification-dot"></span>
            </button>

            <div className="avatar">
              {user?.nome?.[0] || 'U'}
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>

      </main>
    </div>
  );
};