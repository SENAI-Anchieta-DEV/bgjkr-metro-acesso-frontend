import { Outlet, NavLink, Link } from "react-router-dom";
import "../styles/DashboardLayout.css";

// 1. Importar os ícones da pasta assets
import logo from "../assets/logo.svg";
import iconValidar from "../assets/Validar.svg";
import iconListaUser from "../assets/listaUSer.svg";
import iconSair from "../assets/sair.svg";

// 2. Importar os ícones de ação do topo
import iconBell from "../assets/TopAction/Bell.svg";
import iconChat from "../assets/TopAction/Chat.svg";
import iconSetting from "../assets/TopAction/Setting.svg";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      
      {/* 🟦 BARRA LATERAL ESQUERDA */}
      <aside className="sidebar-esquerda">
        {/* LOGO */}
        <Link to="/admin" className="logo-area">
          <img src={logo} alt="Logótipo" className="logo-img" style={{ maxWidth: '40px' }} />
        </Link>
        
        <nav className="menu-icons">
          {/* Ícone 1: Fila de Validações */}
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => isActive ? "icon-btn active" : "icon-btn"}
            title="Validações"
          >
            <img src={iconValidar} alt="Validações" />
          </NavLink>
          
          {/* Ícone 2: Gestão de Utilizadores */}
          <NavLink 
            to="/admin/usuarios" 
            className={({ isActive }) => isActive ? "icon-btn active" : "icon-btn"}
            title="Gestão de Utilizadores"
          >
            <img src={iconListaUser} alt="Utilizadores" />
          </NavLink>
        </nav>
      </aside>

      {/* 🟩 ÁREA CENTRAL */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Acesso Administrador</h2>
          <div className="search-bar">
            <input type="text" placeholder="Buscar..." />
          </div>
        </header>
        
        <div className="dashboard-content">
          {/* O <Outlet /> é o "buraco" onde as páginas vão ser renderizadas */}
          <Outlet /> 
        </div>
      </main>

      {/* 🟨 BARRA LATERAL DIREITA */}
      <aside className="sidebar-direita">
        <div className="top-icons">
          {/* Ícones de Notificação, Chat e Configurações */}
          <button className="icon-btn" title="Notificações">
            <img src={iconBell} alt="Notificações" />
          </button>
          <button className="icon-btn" title="Chat">
            <img src={iconChat} alt="Chat" />
          </button>
          <button className="icon-btn" title="Configurações">
            <img src={iconSetting} alt="Configurações" />
          </button>
          
          {/* O Ícone SAIR agora é o último da direita no topo */}
          <button className="icon-btn logout" title="Sair">
            <img src={iconSair} alt="Sair" />
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">
            <img src={iconSetting} alt="Avatar" style={{ width: '24px' }} />
          </div>
          <p>Admin Metro</p>
          <span className="status-badge">Online</span>
        </div>

        <div className="notifications-panel">
          <h3>Status do Sistema</h3>
          <div className="status-item">
            <span className="dot active"></span> 12 Ativos
          </div>
          <div className="status-item">
            <span className="dot inactive"></span> 3 Inativos
          </div>
        </div>
      </aside>

    </div>
  );
}

export default DashboardLayout;