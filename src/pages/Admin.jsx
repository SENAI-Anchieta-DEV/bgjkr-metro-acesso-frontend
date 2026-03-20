import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));

    // 🔐 proteção de rota
    if (!user || user.tipo !== "admin") {
      navigate("/");
      return;
    }

    carregarUsuarios();
  }, [navigate]);

  function carregarUsuarios() {
    const dados = JSON.parse(localStorage.getItem("cadastros")) || [];
    const pendentes = dados.filter(u => u.status === "pendente");
    setUsuarios(pendentes);
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

  function logout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  }

  return (
    <div className="admin-container">

      <div className="topo">
        <h2>Painel de Aprovações</h2>
        <button className="logout" onClick={logout}>
          Sair
        </button>
      </div>

      <div className="tabela">

        <div className="header">
          <span>Nome</span>
          <span>Tipo</span>
          <span>Status</span>
          <span>Deficiência</span>
          <span>Ações</span>
        </div>

        {usuarios.length === 0 ? (
          <p className="vazio">Nenhum usuário pendente</p>
        ) : (
          usuarios.map((user, index) => (
            <div key={index} className="linha">

              <div className="nome">
                <div className="avatar"></div>
                {user.nome}
              </div>

              <span className="badge tipo">{user.tipo}</span>

              <span className="badge pendente">Pendente</span>

              <span className={`badge def ${user.necessidade?.toLowerCase()}`}>
                {user.necessidade || "-"}
              </span>

              <div className="acoes">
                <button
                  className="btn aprovar"
                  onClick={() => atualizarStatus(user.email, "aprovado")}
                >
                  ✔
                </button>

                <button
                  className="btn rejeitar"
                  onClick={() => atualizarStatus(user.email, "rejeitado")}
                >
                  ✖
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;