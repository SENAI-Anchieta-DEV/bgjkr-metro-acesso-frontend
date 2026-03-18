import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginGeral.css";
import logo from "../assets/logo.svg"; // ícone aqui

function LoginGeral() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("admin");
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

    const usersFixos = [
      { email: "admin@metro.com", senha: "123", tipo: "admin", status: "aprovado" },
      { email: "agente@metro.com", senha: "123", tipo: "agente", status: "aprovado" }
    ];

    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];
    const todosUsuarios = [...usersFixos, ...cadastros];

    const user = todosUsuarios.find(
      (u) =>
        u.email === email &&
        u.senha === senha &&
        u.tipo === tipo
    );

    if (!user) {
      setErro("Credenciais inválidas");
      return;
    }

    if (user.status !== "aprovado") {
      setErro("Cadastro em análise");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.tipo === "admin") navigate("/admin");
    if (user.tipo === "agente") navigate("/agente");
    if (user.tipo === "pcd") navigate("/pcd");
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* TABS */}
        <div className="login-tabs">
          <button
            className={tipo === "admin" ? "active" : ""}
            onClick={() => setTipo("admin")}
          >
            ADMIN
          </button>

          <button
            className={tipo === "pcd" ? "active" : ""}
            onClick={() => setTipo("pcd")}
          >
            PCD
          </button>

          <button
            className={tipo === "agente" ? "active" : ""}
            onClick={() => setTipo("agente")}
          >
            AGENTE
          </button>
        </div>

        {/* LOGO */}
        <img src={logo} alt="logo" className="login-logo" />


        <h2>LOGIN {tipo.toUpperCase()}</h2>

        <form onSubmit={handleLogin}>
          <label>E-mail</label>
          <input
            type="email"
            placeholder="seuemail@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="remember">
            <input type="checkbox" />
            <span>Lembrar minha senha</span>
          </div>

          {erro && <p className="erro">{erro}</p>}

          <button className="btn-primary">Entrar</button>
        </form>

        {/* BOTÃO CADASTRO (só aparece para PCD) */}
        {tipo === "pcd" && (
          <button
            className="btn-secondary"
            onClick={() => navigate("/cadastro")}
          >
            Cadastrar
          </button>
        )}

        <span className="forgot">Esqueceu a senha?</span>
      </div>
    </div>
  );
}

export default LoginGeral;