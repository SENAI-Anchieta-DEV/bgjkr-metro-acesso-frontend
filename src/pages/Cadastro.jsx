import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    necessidade: "",
    endereco: "",
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
    setForm({ ...form, documento: e.target.files[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // validação básica
    if (
      !form.nome ||
      !form.email ||
      !form.senha ||
      !form.necessidade ||
      !form.endereco
    ) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    // pega cadastros existentes
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    // novo usuário
    const novoUsuario = {
      ...form,
      tipo: "pcd",
      status: "pendente"
    };

    cadastros.push(novoUsuario);

    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    setSucesso("Cadastro enviado para análise!");

    // limpa formulário
    setForm({
      nome: "",
      email: "",
      senha: "",
      necessidade: "",
      endereco: "",
      suporte: "sim",
      documento: null
    });

    // volta pro login depois de 2s
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  function voltarLogin() {
    navigate("/login");
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Cadastro PcD</h2>

        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="necessidade"
          placeholder="Tipo de necessidade (ex: cadeirante)"
          value={form.necessidade}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Deseja suporte por padrão?</label>
        <select
          name="suporte"
          value={form.suporte}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>

        <label style={styles.label}>Documento comprobatório</label>
        <input type="file" onChange={handleFile} style={styles.input} />

        {erro && <p style={styles.erro}>{erro}</p>}
        {sucesso && <p style={styles.sucesso}>{sucesso}</p>}

        <button type="submit" style={styles.button}>
          Enviar Cadastro
        </button>

        <button type="button" onClick={voltarLogin} style={styles.buttonVoltar}>
          Voltar para Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1a1a1a",
  },
  form: {
    background: "#2a2a2a",
    padding: "30px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "white",
    width: "350px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    outline: "none",
  },
  label: {
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    background: "#009cde",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonVoltar: {
    padding: "10px",
    background: "#4a4a4a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  erro: {
    color: "red",
    fontSize: "14px",
  },
  sucesso: {
    color: "lightgreen",
    fontSize: "14px",
  },
};

export default Cadastro;