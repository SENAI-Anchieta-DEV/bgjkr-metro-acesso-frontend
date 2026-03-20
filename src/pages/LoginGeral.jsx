import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginGeral.css";

function LoginGeral() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("cadastros")) || [];

    const user = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!user) {
      alert("Email ou senha inválidos!");
      return;
    }

    if (user.status === "pendente") {
      alert("Seu cadastro ainda está em análise.");
      return;
    }

   
    localStorage.setItem("usuarioLogado", JSON.stringify(user));

   // redicina de acordo com o tipo de usuario
    if (user.tipo === "admin") {
      navigate("/admin");
    } else if (user.tipo === "agente") {
      navigate("/agente");
    } else {
      navigate("/pcd");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        <p className="cadastro-link">
          Não tem conta?{" "}
          <span onClick={() => navigate("/cadastro")}>
            Cadastre-se
          </span>
        </p>

      </div>
    </div>
  );
}

export default LoginGeral;