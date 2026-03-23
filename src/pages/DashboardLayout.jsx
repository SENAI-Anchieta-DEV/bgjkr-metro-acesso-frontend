import { Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      
      {/* 🟦 BARRA LATERAL ESQUERDA */}
      <aside className="sidebar-esquerda">
        <div className="logo-area">
          {/* Aqui depois colocaremos a logo da sua imagem */}
          <span className="logo-text">M</span>
        </div>
        
        <nav className="menu-icons">
          {/* Ícones temporários para desenhar o esqueleto */}
          <button className="icon-btn active">🏠</button>
          <button className="icon-btn">👥</button>
          <button className="icon-btn">📋</button>
          <button className="icon-btn">⚙️</button>
        </nav>
      </aside>

      {/* 🟩 ÁREA CENTRAL (Muda de acordo com a página) */}
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

      {/* 🟨 BARRA LATERAL DIREITA */}
      <aside className="sidebar-direita">
        <div className="top-icons">
          <button className="icon-btn">📅</button>
          <button className="icon-btn">🔔</button>
          <button className="icon-btn">💬</button>
        </div>

        <div className="user-profile">
          <div className="avatar">⚙️</div>
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