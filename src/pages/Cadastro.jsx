import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    necessidade: "", 
    suporte: "sim",
    documento: null
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isEdicao, setIsEdicao] = useState(false);

  // 🔹 VERIFICA SE É UMA EDIÇÃO (Usuário Rejeitado)
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado && usuarioLogado.status === "rejeitado") {
      setForm({
        nome: usuarioLogado.nome || "",
        email: usuarioLogado.email || "",
        senha: usuarioLogado.senha || "",
        necessidade: usuarioLogado.necessidade || "",
        suporte: usuarioLogado.suporte || "sim",
        documento: usuarioLogado.documento || null
      });
      setIsEdicao(true);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFile(e) {
    setForm({ ...form, documento: e.target.files[0]?.name }); 
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    let cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    if (isEdicao) {
      // 🔹 ATUALIZA O CADASTRO EXISTENTE
      cadastros = cadastros.map(u => {
        if (u.email === form.email) {
          return { ...form, tipo: "pcd", status: "pendente" };
        }
        return u;
      });
      
      // Atualiza também a sessão do usuário logado para ele ver a tela de "Em análise"
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...form, tipo: "pcd", status: "pendente" }));
      setSucesso("Cadastro reavaliado com sucesso!");
      
    } else {
      // 🔹 CRIA UM NOVO CADASTRO
      const existe = cadastros.find(u => u.email === form.email);
      if (existe) {
        setErro("Este e-mail já está cadastrado.");
        return;
      }

      const novoUsuario = {
        ...form,
        tipo: "pcd",
        status: "pendente"
      };
      cadastros.push(novoUsuario);
      setSucesso("Cadastro enviado para análise!");
    }

    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    // Redireciona dependendo se editou ou se é novo
    setTimeout(() => {
      if (isEdicao) {
        navigate("/pcd"); // Volta pra área do PcD pra ver o status "Pendente"
      } else {
        navigate("/login");
      }
    }, 1500);
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">

        <h2>{isEdicao ? "Atualizar Cadastro" : "Cadastro PcD"}</h2>
        {isEdicao && <p style={{color: '#ff5252', fontSize: '14px', marginBottom: '15px'}}>Por favor, corrija seus dados e envie um novo documento.</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid">

            <div>
              <label>Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} required />
            </div>

            <div>
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required disabled={isEdicao} />
            </div>

            <div>
              <label>Senha</label>
              <input name="senha" type="password" value={form.senha} onChange={handleChange} required />
            </div>

            <div>
              <label>Tipo de Deficiência</label>
              <input name="necessidade" value={form.necessidade} onChange={handleChange} required />
            </div>

          </div>

          <label>Deseja suporte por padrão?</label>
          <select name="suporte" value={form.suporte} onChange={handleChange}>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>

          <label>Documento comprobatório</label>
          <input type="file" onChange={handleFile} required={!isEdicao} />

          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}

          <button className="btn-primary">
            {isEdicao ? "Reenviar para Análise" : "Enviar Cadastro"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              isEdicao ? navigate("/pcd") : navigate("/login");
            }}
          >
            Voltar
          </button>

        </form>
      </div>
    </div>
  );
}

export default Cadastro;