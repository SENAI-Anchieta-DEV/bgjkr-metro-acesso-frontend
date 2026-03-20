import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginGeral.css";

function LoginGeral() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("admin");


  useEffect(() => {
    if (!localStorage.getItem("adminCriado")) {
      const adminProvisorio = {
        nome: "Admin Provisório",
        email: "admin@metro.com",
        senha: "123",
        tipo: "admin",
        status: "aprovado",
      };

      const usuarios = JSON.parse(localStorage.getItem("cadastros")) || [];

      const existe = usuarios.find(
        (u) => u.email === adminProvisorio.email
      );

      if (!existe) {
        usuarios.push(adminProvisorio);
        localStorage.setItem("cadastros", JSON.stringify(usuarios));
      }

      localStorage.setItem("adminCriado", "true");
    }
  }, []);

  function handleLogin(e) {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("cadastros")) || [];

    const user = usuarios.find(
      (u) =>
        u.email === email &&
        u.senha === senha &&
        u.tipo === tipoSelecionado
    );

    if (!user) {
      alert("Dados inválidos!");
      return;
    }


    if (user.status === "pendente") {
      alert("Seu cadastro está em análise.");
      return;
    }

   
    localStorage.setItem("usuarioLogado", JSON.stringify(user));


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

        {/* 🔹 Seleção de tipo */}
        <div className="tabs">
          <button
            className={tipoSelecionado === "admin" ? "active" : ""}
            onClick={() => setTipoSelecionado("admin")}
          >
            ADMIN
          </button>

          <button
            className={tipoSelecionado === "pcd" ? "active" : ""}
            onClick={() => setTipoSelecionado("pcd")}
          >
            PCD
          </button>

          <button
            className={tipoSelecionado === "agente" ? "active" : ""}
            onClick={() => setTipoSelecionado("agente")}
          >
            AGENTE
          </button>
        </div>

        <h2>Login {tipoSelecionado.toUpperCase()}</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
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

        {/* cadastro só pro PcD */}
        {tipoSelecionado === "pcd" && (
          <p className="cadastro-link">
            Não tem conta?{" "}
            <span onClick={() => navigate("/cadastro")}>
              Cadastre-se
            </span>
          </p>
        )}

      </div>
    </div>
  );
}

export default LoginGeral;