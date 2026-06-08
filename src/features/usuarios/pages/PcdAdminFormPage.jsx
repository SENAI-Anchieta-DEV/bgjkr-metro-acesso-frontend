import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import { tagsService } from '../../tags/services/tagsService';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';
import './GestaoUsuariosPage.css';

export const PcdAdminFormPage = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const isEdit = !!email;
  const emailDecoded = email ? decodeURIComponent(email) : '';

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tiposDeficiencia: [],
    desejaSuporte: true,
  });

  const [comprovacao, setComprovacao] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const opcoesDeficiencia = ['VISUAL', 'AUDITIVA', 'MOTORA'];

  useEffect(() => {
    tagsService.listarTodas()
      .then(todas => setTags(todas))
      .catch(() => setTags([]))
      .finally(() => setLoadingTags(false));
  }, []);

  useEffect(() => {
    if (isEdit) {
      usuariosService.buscarPcd(emailDecoded)
        .then(dados => setFormData({
          nome: dados.nome,
          email: dados.email,
          senha: '',
          tiposDeficiencia: dados.tiposDeficiencia || [],
          desejaSuporte: dados.desejaSuporte ?? true,
        }))
        .catch(() => setErro('Não foi possível carregar os dados do usuário PCD.'));
    }
  }, [emailDecoded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (tipo) => {
    setFormData((prev) => {
      const lista = prev.tiposDeficiencia;
      return {
        ...prev,
        tiposDeficiencia: lista.includes(tipo)
          ? lista.filter((t) => t !== tipo)
          : [...lista, tipo],
      };
    });
  };

  const handleFileChange = (e) => {
    setComprovacao(e.target.files?.[0] || null);
  };

  const validarSenha = (senha) => {
    if (!senha) return false;
    return senha.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (formData.tiposDeficiencia.length === 0) {
      setErro('Selecione pelo menos um tipo de deficiência.');
      return;
    }

    // só exige arquivo na criação
    if (!isEdit && !comprovacao) {
      setErro('O comprovação de deficiência é obrigatório.');
      return;
    }

    // valida senha apenas quando preenchida
    if (formData.senha && !validarSenha(formData.senha)) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    // na criação, senha é obrigatória
    if (!isEdit && !formData.senha) {
      setErro('A senha é obrigatória.');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      form.append('nome', formData.nome);
      form.append('email', formData.email);
      form.append('desejaSuporte', formData.desejaSuporte);

      formData.tiposDeficiencia.forEach((tipo) => {
        form.append('tiposDeficiencia', tipo);
      });

      // só envia arquivo se existir (evita sobrescrever no backend)
      if (comprovacao) {
        form.append('comprovacao', comprovacao);
      }

      if (formData.senha) {
        form.append('senha', formData.senha);
      }

      if (!isEdit) {
        await usuariosService.cadastrarPcdDireto(form);
      } else {
        await usuariosService.atualizarPcd(emailDecoded, form);
      }

      setSucesso(true);
      setTimeout(() => navigate('/usuarios'), 1500);

    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(
        err,
        isEdit ? 'Erro ao atualizar usuário PCD.' : 'Erro ao cadastrar usuário PCD.'
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h2>{isEdit ? 'Editar Usuário PCD' : 'Novo Usuário PCD (Gestão)'}</h2>
          <p>{isEdit ? 'Atualize os dados do passageiro PCD.' : 'Cadastre um novo passageiro PCD diretamente no sistema administrativo.'}</p>
        </div>
      </header>

      <div className="table-container" style={{ padding: '30px', backgroundColor: 'var(--cor-fundo-card)' }}>
        {erro && <div className="erro" style={{ marginBottom: '20px' }}>⚠️ {erro}</div>}

        {sucesso && (
          <div className="erro" style={{
            backgroundColor: 'rgba(11, 176, 123, 0.1)',
            borderColor: 'var(--cor-sucesso)',
            color: 'var(--cor-sucesso)',
            marginBottom: '20px'
          }}>
            ✓ {isEdit ? 'Usuário atualizado' : 'Usuário cadastrado'} com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid">

            <div className="full form-group">
              <label>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="full form-group">
              <label>E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="full form-group">
              <label>{isEdit ? 'Nova Senha (mínimo 8 caracteres)' : 'Senha Provisória'}</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required={!isEdit}
                minLength={!isEdit ? 8 : undefined}
              />
            </div>

            <div className="full form-group">
              <label>Tipo(s) de Deficiência</label>
              <div className="checkbox-group" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {opcoesDeficiencia.map((tipo) => (
                  <label key={tipo} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.tiposDeficiencia.includes(tipo)}
                      onChange={() => handleCheckboxChange(tipo)}
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            <div className="full form-group">
              <label>Deseja suporte?</label>
              <select
                value={formData.desejaSuporte}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    desejaSuporte: e.target.value === 'true'
                  }))
                }
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

          </div>

          <div className="full form-group">
            <label>Anexar Laudo Médico ou outra forma de comprovação de deficiência (PDF ou Imagem)</label>
            <div className="file-upload-wrapper">
              <div className="file-upload-text">
                <span>
                  {comprovacao ? '📄 ' + comprovacao.name : '📁 Selecionar arquivo'}
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                required={!isEdit}
              />
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '30px' }}>
            <button type="button" onClick={() => navigate('/usuarios')} className="btn-secondary">
              Cancelar
            </button>

            <button type="submit" disabled={loading || sucesso} className="btn-primary" style={{ flex: 1 }}>
              {loading ? (isEdit ? 'Atualizando...' : 'Cadastrando...') : isEdit ? 'Salvar Alterações' : 'Finalizar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};