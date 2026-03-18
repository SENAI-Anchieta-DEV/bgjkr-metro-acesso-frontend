import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginGeral() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    // usuários fixos
    const usersFixos = [
      { email: "admin@metro.com", senha: "123", tipo: "admin", status: "aprovado" },
      { email: "agente@metro.com", senha: "123", tipo: "agente", status: "aprovado" }
    ];

    // usuários cadastrados
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    const todosUsuarios = [...usersFixos, ...cadastros];

    const user = todosUsuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!user) {
      setErro("Email ou senha inválidos");
      return;
    }

    if (user.status !== "aprovado") {
      setErro("Cadastro em análise. Aguarde aprovação.");
      return;
    }

    // salva seção
    localStorage.setItem("user", JSON.stringify(user));

    //manda pro lugar certo
    if (user.tipo === "admin") {
      navigate("/admin");
    } else if (user.tipo === "agente") {
      navigate("/agente");
    } else {
      navigate("/pcd");
    }
  }

  function irCadastro() {
    navigate("/cadastro");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>MetroAcesso</h1>
        <p style={styles.subtitle}>Sistema de Acessibilidade</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={styles.input}
          />

          {erro && <p style={styles.erro}>{erro}</p>}

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        <button onClick={irCadastro} style={styles.link}>
          Criar conta
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },

  card: {
    background: "#1e1e1e",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },

  title: {
    margin: 0,
    color: "#00bfff",
  },

  subtitle: {
    marginBottom: "20px",
    color: "#ccc",
    fontSize: "14px",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    background: "#2a2a2a",
    color: "white",
  },

  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#00bfff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  link: {
    marginTop: "15px",
    background: "none",
    border: "none",
    color: "#00bfff",
    cursor: "pointer",
    fontSize: "14px",
  },

  erro: {
    color: "#ff4d4d",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default LoginGeral;