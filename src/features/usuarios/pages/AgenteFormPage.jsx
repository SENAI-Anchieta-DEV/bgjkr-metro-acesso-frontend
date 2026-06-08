import { usuariosService } from '../services/usuariosService';
import { estacoesService } from '../../estacoes/services/estacoesService';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';

export const AgenteFormPage = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const isEdit = !!email;
  const emailDecoded = email ? decodeURIComponent(email) : '';

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

  useEffect(() => {
    if (isEdit) {
      usuariosService.buscarAgente(emailDecoded)
        .then(dados => setFormData({
          nome: dados.nome,
          email: dados.email,
          senha: '',
          inicioTurno: dados.inicioTurno || '',
          fimTurno: dados.fimTurno || '',
          codigoEstacao: '', // <- inicia como "Não alterar estação"
        }))
        .catch(() => setErro('Não foi possível carregar os dados do agente.'));
    }
  }, [emailDecoded, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      if (isEdit) {
        const payload = {
          nome: formData.nome,
          email: formData.email,
          inicioTurno: formData.inicioTurno,
          fimTurno: formData.fimTurno,
        };

        // só envia estação se usuário escolher uma nova
        if (formData.codigoEstacao) {
          payload.codigoEstacao = formData.codigoEstacao;
        }

        if (formData.senha) {
          payload.senha = formData.senha;
        }

        await usuariosService.atualizarAgente(emailDecoded, payload);
        alert('Agente atualizado com sucesso!');
      } else {
        await usuariosService.cadastrarAgente(formData);
        alert('Agente de Atendimento cadastrado com sucesso!');
      }

      navigate('/usuarios');
    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(
        err,
        isEdit
          ? 'Erro ao atualizar agente.'
          : 'Erro ao cadastrar o agente. Verifique se o código da Estação existe no sistema.'
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <div className="cadastro-badge agente">Agente de Atendimento</div>
        <h2>{isEdit ? 'Editar Agente' : 'Novo Agente'}</h2>
        <p>
          {isEdit
            ? 'Atualize os dados do agente de atendimento.'
            : 'Regista um novo funcionário e vincula-o a uma estação de atendimento.'}
        </p>
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
          <label>
            {isEdit
              ? 'Nova Senha (deixe em branco para manter)'
              : 'Senha Provisória'}
          </label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required={!isEdit}
            minLength={isEdit ? undefined : 8}
            placeholder={
              isEdit
                ? 'Deixe em branco para não alterar'
                : 'Mínimo 8 caracteres'
            }
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
            required={false}
            disabled={loadingEstacoes}
          >
            {isEdit && (
              <option value="">
                Não alterar estação
              </option>
            )}

            {!isEdit && (
              <option value="">
                {loadingEstacoes
                  ? 'Carregando estações...'
                  : 'Selecione uma estação...'}
              </option>
            )}

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
          <button
            type="button"
            onClick={() => navigate('/usuarios')}
            className="btn-cancelar"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-salvar"
          >
            {loading
              ? 'A guardar...'
              : isEdit
                ? 'Salvar Alterações'
                : 'Guardar Agente'}
          </button>
        </div>
      </form>
    </div>
  );
};