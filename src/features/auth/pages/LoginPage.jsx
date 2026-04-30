import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { useAsync } from '../../../core/hooks/useAsync';
import { getErrorMessage } from '../../../core/utils/error';
import './LoginPage.css';
import voltar from '../../../assets/voltar.svg'

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { execute: login, loading, erro } = useAsync(signIn);

  const mensagemErro = erro
    ? getErrorMessage(erro, 'E-mail ou senha inválidos.')
    : '';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      console.error('Falha no login:', err);
    }
  };

  return (
    <div>
      <Link to="/" className="botao-voltar">
        <img src={voltar} alt="voltar" />
      </Link>
      <div className="login-container">

        <div className="login-box">
          <h2 className="login-title">Acesso o Sistema</h2>
          <p className="login-subtitle">MetroAcesso — Autonomia Acessível</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu endereço de e-mail"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            {mensagemErro && (
              <div className="erro-mensagem">{mensagemErro}</div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;