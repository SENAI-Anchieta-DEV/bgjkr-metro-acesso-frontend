import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    necessidade: "", // 🔥 padronizado
    suporte: "sim",
    documento: null
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFile(e) {
    setForm({ ...form, documento: e.target.files[0]?.name }); // salva nome só
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    const novoUsuario = {
      ...form,
      tipo: "pcd",
      status: "pendente"
    };

    cadastros.push(novoUsuario);

    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    setSucesso("Cadastro enviado para análise!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">

        <h2>Cadastro PcD</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid">

            <div>
              <label>Nome</label>
              <input name="nome" onChange={handleChange} />
            </div>

            <div>
              <label>Email</label>
              <input name="email" type="email" onChange={handleChange} />
            </div>

            <div>
              <label>Senha</label>
              <input name="senha" type="password" onChange={handleChange} />
            </div>

            <div>
              <label>Tipo de Deficiência</label>
              <input name="necessidade" onChange={handleChange} />
            </div>

          </div>

          <label>Deseja suporte por padrão?</label>
          <select name="suporte" onChange={handleChange}>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>

          <label>Documento comprobatório</label>
          <input type="file" onChange={handleFile} />

          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}

          <button className="btn-primary">Enviar Cadastro</button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/login")}
          >
            Voltar
          </button>

        </form>
      </div>
    </div>
  );
}

export default Cadastro;  