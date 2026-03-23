import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginGeral";
import Cadastro from "./pages/Cadastro";
import Admin from "./pages/Admin";
import Pcd from "./pages/Pcd";
import DashboardLayout from "./pages/DashboardLayout"; // 🔹 Importe o Layout

function Agente() {
  return <h1>Agente (Em construção)</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de fora do Layout (Telas cheias) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pcd" element={<Pcd />} />

        {/* 🔹 Rotas ENVELOPADAS pelo Layout (Com Barras Laterais) */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/agente" element={<Agente />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;