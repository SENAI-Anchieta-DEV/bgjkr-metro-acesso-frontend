import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// páginas
import LoginGeral from "./pages/LoginGeral.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Admin from "./pages/Admin.jsx";
import Pcd from "./pages/Pcd.jsx";

// css global
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginGeral />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pcd" element={<Pcd />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;