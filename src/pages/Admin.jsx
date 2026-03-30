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
    const pcds = dados.filter(u => u.tipo === "pcd" && u.status === "pendente");
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
    carregarUsuarios(); // Recarrega a lista para remover o utilizador da tabela
  }

  return (
    <div className="admin-tabela-container">
      <div className="admin-header-tabela">
        <h3 className="titulo-tabela">Fila de Validações</h3>
        <span className="contador-pendentes">{usuarios.length} Pendentes</span>
      </div>

      <div className="tabela-card">
        <div className="tabela-cabecalho">
          <span>Utilizador</span>
          <span>Estado</span>
          <span>Deficiência</span>
          <span>Comprovativo</span>
          <span>Ações</span>
        </div>

        <div className="tabela-corpo">
          {usuarios.length === 0 ? (
            <div className="estado-vazio">
              <span className="icone-vazio">🎉</span>
              <p>Nenhuma validação pendente no momento.</p>
            </div>
          ) : (
            usuarios.map((user, index) => (
              <div key={index} className="tabela-linha">
                
                {/* Nome e Avatar */}
                <div className="coluna-perfil">
                  <div className="avatar-iniciais">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="info-perfil">
                    <span className="nome-texto">{user.nome}</span>
                    <span className="tag-tipo">PCD</span>
                  </div>
                </div>

                {/* Estado Pendente */}
                <div>
                  <span className="badge-estado pendente">A aguardar</span>
                </div>

                {/* Tipo de Deficiência */}
                <div>
                  <span className="badge-deficiencia">
                    {user.necessidade || "Não informado"}
                  </span>
                </div>

                {/* Documento */}
                <div>
                  <div className="badge-documento">
                    📄 {user.documento || "Anexo"}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="coluna-acoes">
                  <button
                    className="btn-acao aprovar"
                    onClick={() => atualizarStatus(user.email, "aprovado")}
                    title="Aprovar Cadastro"
                  >
                    ✓ Aprovar
                  </button>
                  <button
                    className="btn-acao rejeitar"
                    onClick={() => atualizarStatus(user.email, "rejeitado")}
                    title="Rejeitar Cadastro"
                  >
                    ✕ Rejeitar
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;