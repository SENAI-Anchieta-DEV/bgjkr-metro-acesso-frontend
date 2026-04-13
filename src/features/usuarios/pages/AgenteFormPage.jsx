import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

export const AgenteFormPage = () => {
  const navigate = useNavigate();
  
  // 1. O Estado reflete EXATAMENTE o AgenteRequestDto do Java
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    estacaoId: '' // O Java espera o ID da estação (ex: 1, 2, ou um UUID)
  });
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      // O Payload exato que será enviado para o Java
      const payload = {
        ...formData,
        estacaoId: formData.estacaoId // Garante que é enviado como string/número conforme o teu back-end pede
      };
      
      console.log("A enviar para o Java:", payload);
      
      // Aqui vais descomentar quando ligarmos o axios (usuariosService)
      // await usuariosService.criarAgente(payload);
      
      alert('Agente de Atendimento cadastrado com sucesso!');
      navigate('/usuarios');
      
    } catch (error) {
      console.error(error);
      setErro('Erro ao cadastrar o agente. Verifica se o ID da Estação existe no sistema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h2>Novo Agente de Atendimento</h2>
        <p>Regista um novo funcionário e vincula-o a uma estação.</p>
      </div>
      
      {erro && <div className="erro-mensagem">{erro}</div>}

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label>Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Maria Santos"
          />
        </div>

        <div className="form-group">
          <label>E-mail Corporativo</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="maria@metro.com.br"
          />
        </div>

        <div className="form-group">
          <label>Senha Provisória</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            placeholder="Cria uma senha de acesso"
          />
        </div>

        <div className="form-group">
          <label>ID da Estação</label>
          <input
            type="text"
            name="estacaoId"
            value={formData.estacaoId}
            onChange={handleChange}
            required
            placeholder="Ex: 1 (ID da estação no banco de dados)"
          />
          <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
            *Para testes, insere o ID de uma estação que já exista na tua base de dados.
          </small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/usuarios')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-salvar">
            {loading ? 'A salvar...' : 'Salvar Agente'}
          </button>
        </div>
      </form>
    </div>
  );
};