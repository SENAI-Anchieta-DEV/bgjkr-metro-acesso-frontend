import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import './Cadastro.css'; 
import { getErrorMessage } from '../../../core/utils/error';

// 1. CORREÇÃO: Usando 'export const' para não quebrar a rota (tela branca)
export const AdminFormPage = () => {
  const navigate = useNavigate();
  
  // 2. CORREÇÃO: Estado apenas com nome, email e senha (Exatamente o que o Java DTO pede)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      // 3. INTEGRAÇÃO: Dispara a requisição para o backend
      await usuariosService.cadastrarAdmin(formData);
      
      alert('Administrador cadastrado com sucesso!');
      navigate('/usuarios'); 
      
    } catch (err) {
      console.error("Erro ao cadastrar Admin:", err);
      setErro(getErrorMessage(err, 'Ocorreu um erro...'))
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h2>Novo Administrador</h2>
        <p>Preencha os dados abaixo para criar um novo acesso de gestão.</p>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        {/* CAMPO CPF REMOVIDO: O AdminRequestDto.java não exige CPF */}

        <div className="form-group">
          <label htmlFor="email">E-mail Corporativo</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@metro.com.br"
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
            placeholder="Crie uma senha forte"
            required
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
            {loading ? 'Salvando...' : 'Salvar Cadastro'}
          </button>
        </div>
      </form>
    </div>
  );
};