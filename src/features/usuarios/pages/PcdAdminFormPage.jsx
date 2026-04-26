import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';
import './GestaoUsuariosPage.css';

export const PcdAdminFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tiposDeficiencia: [],
    desejaSuporte: true,
  });
  const [comprovacao, setComprovacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const opcoesDeficiencia = ['VISUAL', 'AUDITIVA', 'MOTORA'];

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
    setComprovacao(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (formData.tiposDeficiencia.length === 0) {
      setErro('Selecione pelo menos um tipo de deficiência.');
      return;
    }
    if (!comprovacao) {
      setErro('O laudo médico é obrigatório.');
      return;
    }

    setLoading(true);

    try {


      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('email', formData.email);
      data.append('senha', formData.senha);
      data.append('desejaSuporte', formData.desejaSuporte);
      formData.tiposDeficiencia.forEach((tipo) => data.append('tiposDeficiencia', tipo));
      data.append('comprovacao', comprovacao);



      await usuariosService.cadastrarPcd(data);
      setSucesso(true);
      setTimeout(() => navigate('/usuarios'), 1500);
    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(err, 'Erro ao cadastrar usuário PCD.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h2>Novo Usuário PCD (Gestão)</h2>
          <p>Cadastre um novo passageiro PCD diretamente no sistema administrativo.</p>
        </div>
      </header>

      <div className="table-container" style={{ padding: '30px', backgroundColor: 'var(--cor-fundo-card)' }}>
        {erro && <div className="erro" style={{ marginBottom: '20px' }}><span>⚠️</span> {erro}</div>}
        {sucesso && (
          <div className="erro" style={{ backgroundColor: 'rgba(11, 176, 123, 0.1)', borderColor: 'var(--cor-sucesso)', color: 'var(--cor-sucesso)', marginBottom: '20px' }}>
            <span>✓</span> Usuário cadastrado com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="full form-group">
              <label>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Nome do passageiro" />
            </div>

            <div className="full form-group">
              <label>E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@exemplo.com" />
            </div>

            <div className="full form-group">
              <label>Senha Provisória</label>
              <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Defina uma senha inicial (mín. 8 caracteres)" required minLength={8} />
            </div>

            <div className="full form-group">
              <label>Tipo(s) de Deficiência</label>
              <div className="checkbox-group" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {opcoesDeficiencia.map((tipo) => (
                  <label key={tipo} className="checkbox-item">
                    <input type="checkbox" checked={formData.tiposDeficiencia.includes(tipo)} onChange={() => handleCheckboxChange(tipo)} />
                    {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div className="full form-group">
              <label>Deseja suporte?</label>
              <select name="desejaSuporte" value={formData.desejaSuporte} onChange={(e) => setFormData((prev) => ({ ...prev, desejaSuporte: e.target.value === 'true' }))}>
                <option value="true">Sim, ativar assistência</option>
                <option value="false">Não, manter autonomia</option>
              </select>
            </div>

            <div className="full form-group">
              <label>Laudo Médico / Comprovação</label>
              <div className="file-upload-wrapper" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <div className="file-upload-text">
                  <span>{comprovacao ? '📄 ' + comprovacao.name : '📁 Clique para selecionar o arquivo'}</span>
                </div>
                <input type="file" accept=".pdf,image/*" onChange={handleFileChange} required />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '30px' }}>
            <button type="button" onClick={() => navigate('/usuarios')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading || sucesso} className="btn-primary" style={{ flex: 1 }}>
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};