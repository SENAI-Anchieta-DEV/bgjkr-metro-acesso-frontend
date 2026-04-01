import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import './DashboardLayout.css'; 

import logo from '../../assets/logo.svg';
import homeIcon from '../../assets/Home.svg';
import validarIcon from '../../assets/Validar.svg';
import listaUserIcon from '../../assets/listaUSer.svg';
import pendenciasIcon from '../../assets/Pendencias.svg';
import sairIcon from '../../assets/sair.svg';

import bellIcon from '../../assets/TopAction/Bell.svg';
import chatIcon from '../../assets/TopAction/Chat.svg';
import mailIcon from '../../assets/TopAction/Mail.svg';
import settingIcon from '../../assets/TopAction/Setting.svg';

export default function DashboardLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar-esquerda">
        <div className="logo-area">
          <img src={logo} alt="Metrô" className="logo" />
        </div>
        
        <nav className="menu-icons">
          <NavLink to="/admin" className={({isActive}) => isActive ? "icon-btn active" : "icon-btn"}>
            <img src={homeIcon} alt="Home" />
          </NavLink>
          
          <NavLink to="/usuarios" className={({isActive}) => isActive ? "icon-btn active" : "icon-btn"}>
            <img src={listaUserIcon} alt="Usuários" />
          </NavLink>

          <button className="icon-btn">
            <img src={validarIcon} alt="Validar" />
          </button>

          <button className="icon-btn">
            <img src={pendenciasIcon} alt="Pendências" />
          </button>
          
          <button className="icon-btn" onClick={handleLogout}>
            <img src={sairIcon} alt="Sair" />
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Painel de Controle</h2>
          <div className="search-bar">
            <input type="text" placeholder="Buscar..." />
          </div>
        </header>

        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>

      <aside className="sidebar-direita">
        <div className="top-icons">
          <img src={bellIcon} alt="Notificações" className="icon-action" />
          <img src={chatIcon} alt="Chat" className="icon-action" />
          <img src={mailIcon} alt="Mensagens" className="icon-action" />
          <img src={settingIcon} alt="Configurações" className="icon-action" />
        </div>

        <div className="user-profile">
          <div className="avatar">👤</div>
          <span className="status-badge">{user?.role || 'ADMIN'}</span>
          <h4 style={{color: 'var(--cor-texto-forte)'}}>Olá, {user?.nome || 'Gestor'}</h4>
        </div>

        <div className="status-panel">
          <h5 style={{color: 'var(--cor-texto-suave)', marginBottom: '15px'}}>SISTEMA</h5>
          <div className="status-item"><span className="dot active"></span> Operação Normal</div>
          <div className="status-item"><span className="dot active"></span> Sensores Online</div>
          <div className="status-item"><span className="dot inactive"></span> Manutenção Estação Luz</div>
        </div>
      </aside>
    </div>
  );
}