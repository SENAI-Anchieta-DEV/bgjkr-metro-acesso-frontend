import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));

 
    if (!user || user.tipo !== "admin") {
      navigate("/");
      return;
    }

    carregarUsuarios();
  }, [navigate]);
function carregarUsuarios() {
    const dados = JSON.parse(localStorage.getItem("cadastros")) || [];
    console.log("1. Todos os cadastros no banco:", dados); 

    const pcds = dados.filter(u => u.tipo === "pcd" && u.status === "pendente");
    console.log("2. Pendentes encontrados para o Admin:", pcds); 

    setUsuarios(pcds);
  }

  function atualizarStatus(email, novoStatus) {
    const dados = JSON.parse(localStorage.getItem("cadastros")) || [];

    const atualizados = dados.map(u => {
      if (u.email === email) {
        return { ...u, status: novoStatus };
      }
      return u;
    });

    localStorage.setItem("cadastros", JSON.stringify(atualizados));
    carregarUsuarios();
  }

  return (
    <div className="admin-container">

      <h2 className="titulo">Validações</h2>

      <div className="card">

        <div className="header">
          <span>Nome</span>
          <span>Status</span>
          <span>Deficiência</span>
          <span>Comprovação</span>
          <span>Ações</span>
        </div>

        {usuarios.length === 0 ? (
          <p className="vazio">Nenhuma validação pendente</p>
        ) : (
          usuarios.map((user, index) => (
            <div key={index} className="linha">

              {/* Nome + ícone */}
              <div className="nome">
                <div className="avatar"></div>
                <span>{user.nome}</span>
                <span className="tag-pcd">PCD</span>
              </div>

              {/* Status */}
              <span className="badge ativo">Ativo</span>

              {/* Deficiência */}
              <span className={`badge def ${user.necessidade?.toLowerCase()}`}>
                {user.necessidade || "-"}
              </span>

              {/* Documento */}
              <span className="documento">Documento </span>

              {/* Ações */}
              <div className="acoes">
                <button
                  className="validar"
                  onClick={() => atualizarStatus(user.email, "aprovado")}
                >
                  Validar
                </button>

                <button
                  className="rejeitar"
                  onClick={() => atualizarStatus(user.email, "rejeitado")}
                >
                  Rejeitar
                </button>
              </div>

            </div>
          ))
        )}

      </div>

      <footer className="footer">MetroAcesso</footer>
    </div>
  );
}

export default Admin;