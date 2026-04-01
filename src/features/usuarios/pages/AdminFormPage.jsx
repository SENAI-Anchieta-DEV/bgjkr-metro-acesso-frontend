import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import './Cadastro.css'; // Usamos o seu CSS de cadastro original

export default function AdminFormPage() {
  const navigate = useNavigate();
  
  // Estado para guardar os dados digitados
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Função para atualizar o estado quando o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Função que dispara quando clica em "Salvar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      // Chama o serviço que vai bater no Back-end (POST /admin)
      await usuariosService.cadastrarAdmin(formData);
      
      alert('Administrador cadastrado com sucesso!');
      navigate('/usuarios'); // Volta para a tela dos 3 cards
      
    } catch (err) {
      console.error("Erro ao cadastrar Admin:", err);
      // Se o Java devolver uma mensagem de erro (ex: Email já existe)
      if (err.response && err.response.data && err.response.data.message) {
        setErro(err.response.data.message);
      } else {
        setErro('Ocorreu um erro ao cadastrar o administrador. Verifique os dados.');
      }
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
}