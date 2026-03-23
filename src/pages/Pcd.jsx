import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Pcd.css";

function Pcd() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    // proteção de rota
    if (!usuarioLogado || usuarioLogado.tipo !== "pcd") {
      navigate("/");
      return;
    }

    setUser(usuarioLogado);
  }, [navigate]);

  function logout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="pcd-container">

      <div className="topo">
        <h1>Área do Usuário</h1>
        <button className="logout" onClick={logout}>
          Sair
        </button>
      </div>

      {/* STATUS */}
      {user.status === "aprovado" && (
        <div className="card aprovado">
          <h2>✅ Cadastro aprovado</h2>
          <p>Bem-vindo ao sistema MetroAcesso.</p>
        </div>
      )}

      {user.status === "rejeitado" && (
        <div className="card rejeitado">
          <h2>❌ Cadastro rejeitado</h2>
          <p>Envie uma nova comprovação de deficiência.</p>

          <button
            className="editar"
            onClick={() => navigate("/cadastro")}
          >
            Editar Cadastro
          </button>
        </div>
      )}

      {user.status === "pendente" && (
        <div className="card pendente">
          <h2>⏳ Em análise</h2>
          <p>Seu cadastro está sendo avaliado.</p>
        </div>
      )}

    </div>
  );
}

export default Pcd;