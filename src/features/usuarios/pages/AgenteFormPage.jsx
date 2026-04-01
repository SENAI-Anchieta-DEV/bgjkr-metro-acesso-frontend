import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import './Cadastro.css';

export default function AgenteFormPage() {
  const navigate = useNavigate();
  
  // Estado para guardar os dados do Agente
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
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
      // Dispara para o serviço que bate em POST /agente
      await usuariosService.cadastrarAgente(formData);
      
      alert('Agente de Metrô cadastrado com sucesso!');
      navigate('/usuarios'); // Devolve para a tela de escolha de perfis
      
    } catch (err) {
      console.error("Erro ao cadastrar Agente:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setErro(err.response.data.message);
      } else {
        setErro('Ocorreu um erro ao cadastrar o agente. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h2>Novo Agente de Metrô</h2>
        <p>Cadastre um novo funcionário para operação nas estações.</p>
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
            placeholder="Nome do agente"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="Apenas números"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail Operacional</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="agente@metro.com.br"
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
            placeholder="Defina uma senha"
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
}