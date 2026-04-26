
import { usuariosService } from '../services/usuariosService';
import { estacoesService } from '../../estacoes/services/estacoesService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';

export const AgenteFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    inicioTurno: '',
    fimTurno: '',
    codigoEstacao: '',
  });

  const [estacoes, setEstacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEstacoes, setLoadingEstacoes] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarEstacoes = async () => {
      try {
        const dados = await estacoesService.listarTodas();
        setEstacoes(dados);
      } catch (err) {
        console.error('Erro ao carregar estações:', err);
      } finally {
        setLoadingEstacoes(false);
      }
    };
    carregarEstacoes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      await usuariosService.cadastrarAgente(formData);
      alert('Agente de Atendimento cadastrado com sucesso!');
      navigate('/usuarios');
    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(err, 'Erro ao cadastrar o agente. Verifique se o código da Estação existe no sistema.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <div className="cadastro-badge agente">Agente de Atendimento</div>
        <h2>Novo Agente</h2>
        <p>Regista um novo funcionário e vincula-o a uma estação de atendimento.</p>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

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
            minLength={8}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Início do Turno</label>
            <input
              type="time"
              name="inicioTurno"
              value={formData.inicioTurno}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fim do Turno</label>
            <input
              type="time"
              name="fimTurno"
              value={formData.fimTurno}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Estação de Atendimento</label>
          <select
            name="codigoEstacao"
            value={formData.codigoEstacao}
            onChange={handleChange}
            required
            disabled={loadingEstacoes}
          >
            <option value="">{loadingEstacoes ? 'Carregando estações...' : 'Selecione uma estação...'}</option>
            {estacoes.map(e => (
              <option key={e.codigoEstacao} value={e.codigoEstacao}>
                {e.nome} ({e.codigoEstacao})
              </option>
            ))}
          </select>
          <small className="form-hint">
            O agente será vinculado a esta estação para controle de acesso.
          </small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/usuarios')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-salvar">
            {loading ? 'A guardar...' : 'Guardar Agente'}
          </button>
        </div>
      </form>
    </div>
  );
};