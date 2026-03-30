import { useState, useEffect } from "react";
import "../styles/GestaoUsuarios.css";

function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Controle do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [passoModal, setPassoModal] = useState("selecao"); // "selecao" | "formulario"
  
  // Dados do formulário
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [form, setForm] = useState({
    nome: "", email: "", senha: "",
    matricula: "", estacao: "", // Específicos de Agente/Admin
    necessidade: "", documento: "" // Específicos de PcD
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function carregarUsuarios() {
    const dados = JSON.parse(localStorage.getItem("cadastros")) || [];
    setUsuarios(dados);
  }

  function abrirModal() {
    setPassoModal("selecao");
    setTipoSelecionado("");
    setForm({ nome: "", email: "", senha: "", matricula: "", estacao: "", necessidade: "", documento: "" });
    setModalAberto(true);
  }

  function escolherTipo(tipo) {
    setTipoSelecionado(tipo);
    setPassoModal("formulario");
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function lidarComMudanca(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvarUsuario(e) {
    e.preventDefault();
    let dados = JSON.parse(localStorage.getItem("cadastros")) || [];

    const existe = dados.find(u => u.email === form.email);
    if (existe) {
      alert("Este e-mail já está cadastrado!");
      return;
    }

    // Montar o objeto dependendo do tipo (para não salvar campos inúteis)
    let novoUsuario = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      tipo: tipoSelecionado,
      status: "aprovado" // Como é o Admin criando, já entra aprovado
    };

    if (tipoSelecionado === "agente") {
      novoUsuario.matricula = form.matricula;
      novoUsuario.estacao = form.estacao;
    } else if (tipoSelecionado === "admin") {
      novoUsuario.matricula = form.matricula;
    } else if (tipoSelecionado === "pcd") {
      novoUsuario.necessidade = form.necessidade;
      novoUsuario.documento = form.documento;
    }

    dados.push(novoUsuario);
    localStorage.setItem("cadastros", JSON.stringify(dados));
    carregarUsuarios();
    fecharModal();
  }

  function excluirUsuario(email) {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      let dados = JSON.parse(localStorage.getItem("cadastros")) || [];
      dados = dados.filter(u => u.email !== email);
      localStorage.setItem("cadastros", JSON.stringify(dados));
      carregarUsuarios();
    }
  }

  return (
    <div className="gestao-container">
      <div className="gestao-header">
        <div>
          <h3 className="titulo-gestao">Gestão de Usuários</h3>
          <p className="subtitulo-gestao">Controle os acessos de Administradores, Agentes e Passageiros (PcD).</p>
        </div>
        <button className="btn-novo" onClick={abrirModal}>+ Novo Usuário</button>
      </div>

      <div className="tabela-card">
        <div className="tabela-cabecalho gestao-grid">
          <span>Usuário</span>
          <span>E-mail</span>
          <span>Perfil</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        <div className="tabela-corpo">
          {usuarios.length === 0 ? (
            <div className="estado-vazio">Nenhum usuário cadastrado.</div>
          ) : (
            usuarios.map((user, index) => (
              <div key={index} className="tabela-linha gestao-grid">
                <span className="nome-texto">{user.nome}</span>
                <span className="email-texto">{user.email}</span>
                <span className={`badge-perfil ${user.tipo}`}>{user.tipo}</span>
                <span className={`badge-status ${user.status}`}>{user.status}</span>
                
                <div className="coluna-acoes">
                  <button className="btn-acao excluir" onClick={() => excluirUsuario(user.email)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {/* ETAPA 1: ESCOLHER O TIPO */}
            {passoModal === "selecao" && (
              <div className="modal-etapa-selecao">
                <h3>Qual perfil deseja cadastrar?</h3>
                <div className="opcoes-perfil">
                  <div className="card-opcao admin" onClick={() => escolherTipo("admin")}>
                    <span className="icone-opcao">⚙️</span>
                    <h4>Administrador</h4>
                    <p>Acesso total ao sistema</p>
                  </div>
                  <div className="card-opcao agente" onClick={() => escolherTipo("agente")}>
                    <span className="icone-opcao">🚇</span>
                    <h4>Agente</h4>
                    <p>Atendimento nas estações</p>
                  </div>
                  <div className="card-opcao pcd" onClick={() => escolherTipo("pcd")}>
                    <span className="icone-opcao">🧑‍🦽</span>
                    <h4>Passageiro (PcD)</h4>
                    <p>Usuário do serviço</p>
                  </div>
                </div>
                <div className="modal-acoes-centro">
                  <button className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                </div>
              </div>
            )}

            {/* ETAPA 2: PREENCHER FORMULÁRIO DINÂMICO */}
            {passoModal === "formulario" && (
              <div className="modal-etapa-formulario">
                <div className="modal-header-form">
                  <h3>Novo Cadastro: <span className="destaque-tipo">{tipoSelecionado.toUpperCase()}</span></h3>
                  <button className="btn-voltar" onClick={() => setPassoModal("selecao")}>← Voltar</button>
                </div>

                <form onSubmit={salvarUsuario}>
                  {/* Campos Comuns a todos */}
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input name="nome" value={form.nome} onChange={lidarComMudanca} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>E-mail</label>
                      <input name="email" type="email" value={form.email} onChange={lidarComMudanca} required />
                    </div>
                    <div className="form-group">
                      <label>Senha Provisória</label>
                      <input name="senha" type="text" value={form.senha} onChange={lidarComMudanca} required />
                    </div>
                  </div>

                  {/* Campos Específicos: ADMIN */}
                  {tipoSelecionado === "admin" && (
                    <div className="form-group">
                      <label>Matrícula do Funcionário</label>
                      <input name="matricula" value={form.matricula} onChange={lidarComMudanca} required />
                    </div>
                  )}

                  {/* Campos Específicos: AGENTE */}
                  {tipoSelecionado === "agente" && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Matrícula</label>
                        <input name="matricula" value={form.matricula} onChange={lidarComMudanca} required />
                      </div>
                      <div className="form-group">
                        <label>Estação Base</label>
                        <select name="estacao" value={form.estacao} onChange={lidarComMudanca} required>
                          <option value="">Selecione...</option>
                          <option value="Estação Sé">Estação Sé</option>
                          <option value="Estação Luz">Estação Luz</option>
                          <option value="Estação Paulista">Estação Paulista</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Campos Específicos: PCD */}
                  {tipoSelecionado === "pcd" && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tipo de Deficiência</label>
                        <input name="necessidade" value={form.necessidade} onChange={lidarComMudanca} required />
                      </div>
                      <div className="form-group">
                        <label>Nº do Laudo / Documento</label>
                        <input name="documento" value={form.documento} onChange={lidarComMudanca} required />
                      </div>
                    </div>
                  )}

                  <div className="modal-acoes">
                    <button type="button" className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                    <button type="submit" className="btn-salvar">Concluir Cadastro</button>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoUsuarios;