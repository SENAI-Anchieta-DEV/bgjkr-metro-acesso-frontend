import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../../core/hooks/useAsync';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';

export const AdminFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const { execute: cadastrarAdmin, loading, erro } =
    useAsync(usuariosService.cadastrarAdmin);

  const mensagemErro = erro
    ? getErrorMessage(erro, 'Erro ao cadastrar administrador.')
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await cadastrarAdmin(formData);
      alert('Administrador cadastrado com sucesso!');
      navigate('/usuarios');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <div className="cadastro-badge admin">Administrador</div>
        <h2>Novo Administrador</h2>
        <p>Preencha os dados para criar um novo acesso de gestão completo ao sistema.</p>
      </div>

      {mensagemErro && (
        <div className="error-banner">{mensagemErro}</div>
      )}

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail Corporativo</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha de Acesso</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate('/usuarios')}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-salvar"
            disabled={loading}
          >
            {loading ? 'A guardar...' : 'Guardar Administrador'}
          </button>
        </div>
      </form>
    </div>
  );
};