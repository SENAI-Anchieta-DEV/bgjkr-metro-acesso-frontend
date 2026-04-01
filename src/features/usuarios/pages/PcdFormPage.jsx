import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import './Cadastro.css'; // O mesmo CSS para manter a identidade visual

export default function PcdFormPage() {
  const navigate = useNavigate();
  
  // Estado para guardar os dados do PcD
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    tipoDeficiencia: '' // Campo extra específico do PcD
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
      // Bate no POST /pcd do teu backend
      await usuariosService.cadastrarPcd(formData);
      
      alert('Usuário PcD cadastrado com sucesso!');
      navigate('/usuarios'); // Volta para os 3 cartões
      
    } catch (err) {
      console.error("Erro ao cadastrar PcD:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setErro(err.response.data.message);
      } else {
        setErro('Ocorreu um erro ao cadastrar o utilizador PcD. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h2>Novo Utilizador PcD</h2>
        <p>Cadastre um novo passageiro para libertação de acesso especial.</p>
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
            placeholder="Nome do passageiro"
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
          <label htmlFor="email">E-mail de Contacto</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="passageiro@email.com"
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
            placeholder="Crie uma senha segura"
            required
          />
        </div>

        {/* Campo Específico do PcD */}
        <div className="form-group">
          <label htmlFor="tipoDeficiencia">Tipo de Deficiência</label>
          <select 
            id="tipoDeficiencia" 
            name="tipoDeficiencia" 
            value={formData.tipoDeficiencia} 
            onChange={handleChange}
            required
            className="form-select" // Adiciona esta classe ao teu CSS se precisares de a estilizar
          >
            <option value="" disabled>Selecione uma opção...</option>
            <option value="VISUAL">Visual</option>
            <option value="AUDITIVA">Auditiva</option>
            <option value="MOTORA">Motora</option>
          </select>
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
            {loading ? 'A Guardar...' : 'Salvar Registo'}
          </button>
        </div>
      </form>
    </div>
  );
}