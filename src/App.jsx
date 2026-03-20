import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginGeral";
import Cadastro from "./pages/Cadastro";

// páginas temporárias (depois vamos criar de verdade)
function Admin() {
  return <h1>Admin</h1>;
}

function Agente() {
  return <h1>Agente</h1>;
}

function Pcd() {
  return <h1>PcD</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/agente" element={<Agente />} />
        <Route path="/pcd" element={<Pcd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;