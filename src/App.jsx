import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Importar as páginas de ecrã inteiro (Públicas e PcD)
import Login from "./pages/LoginGeral";
import Cadastro from "./pages/Cadastro";
import Pcd from "./pages/Pcd";

// 2. Importar o Layout e as páginas do painel administrativo
import DashboardLayout from "./pages/DashboardLayout";
import Admin from "./pages/Admin";
import GestaoUsuarios from "./pages/GestaoUsuarios";

// 3. Página temporária para o Agente (até construirmos a interface real)
function Agente() {
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Área do Agente (Em construção 🚧)</h2>
      <p>Em breve faremos a lista de atendimentos aqui.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔴 ROTAS EXTERNAS (Sem as barras laterais) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pcd" element={<Pcd />} />

        {/* 🔵 ROTAS INTERNAS DO DASHBOARD (Envolvidas pelo Layout) */}
        {/* Tudo o que estiver aqui dentro vai aparecer no "miolo" do DashboardLayout */}
        <Route element={<DashboardLayout />}>
          
          {/* Ícone 1: Fila de Validações */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Ícone 2: Gestão de Utilizadores */}
          <Route path="/admin/usuarios" element={<GestaoUsuarios />} />
          
          {/* Tela do Agente (que no futuro também usará o layout do dashboard) */}
          <Route path="/agente" element={<Agente />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;