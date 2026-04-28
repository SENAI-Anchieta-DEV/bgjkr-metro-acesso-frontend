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

          {/* Menu Administrativo */}
          {user?.role === 'ADMINISTRADOR' && (
            <>
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
            <button className="action-btn">

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