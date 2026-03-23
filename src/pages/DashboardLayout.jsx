import { Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css";
import logo from "../assets/logo.svg";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      
      {/* BARRA ESQUERDA */}
      <aside className="sidebar-esquerda">
        <div className="logo-area">
         <img className="logo" src={logo} alt="Logo" />
        </div>
        
        <nav className="menu-icons">
          {/* Mudar incons depois */}
          <button className="icon-btn active">0</button>
          <button className="icon-btn">1</button>
          <button className="icon-btn">3</button>
          <button className="icon-btn">4</button>
        </nav>
      </aside>

      {/*CENTRAL*/}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Acesso Administrador</h2>
          <div className="search-bar">
            <input type="text" placeholder="Buscar..." />
          </div>
        </header>
        
        <div className="dashboard-content">
          {/* O <Outlet /> é onde o React vai injetar o Admin.jsx ou Agente.jsx */}
          <Outlet /> 
        </div>
      </main>

      {/* BARRRA DIREITA */}
      <aside className="sidebar-direita">
        <div className="top-icons">
          <button className="icon-btn">1</button>
          <button className="icon-btn">2</button>
          <button className="icon-btn">3</button>
        </div>

        <div className="user-profile">
          <div className="avatar">perfil</div>
          <p></p>
          <span className="status-badge">Admin</span>
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