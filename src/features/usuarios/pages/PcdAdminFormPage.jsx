import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';

export const PcdAdminFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tiposDeficiencia: [],
    desejaSuporte: true,
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (formData.tiposDeficiencia.length === 0) {
      setErro('Selecione pelo menos um tipo de deficiência.');
      return;
    }

    setLoading(true);

    try {
      // Como o back-end original não tem endpoint de cadastro direto de PCD,
      // usamos o fluxo de formulário via FormData.
      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('email', formData.email);
      data.append('senha', formData.senha);
      data.append('desejaSuporte', formData.desejaSuporte);
      formData.tiposDeficiencia.forEach(t => data.append('tiposDeficiencia', t));
      
      // Nota: O back original exige um arquivo de comprovação. 
      // Se for necessário, você pode adicionar um campo de arquivo aqui também.
      
      await usuariosService.cadastrarPcd(data);
      setSucesso(true);
      setTimeout(() => navigate('/validacoes'), 1500);
    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(err, 'Erro ao cadastrar usuário PCD. Verifique os dados informados.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h2>Novo Usuário PCD (Gestão)</h2>
          <p>Cadastre um novo passageiro PCD diretamente no sistema administrativo.</p>
        </div>

        {erro && <div className="erro"><span>⚠️</span> {erro}</div>}
        {sucesso && (
          <div className="erro" style={{ backgroundColor: 'rgba(11, 176, 123, 0.1)', borderColor: 'var(--cor-sucesso)', color: 'var(--cor-sucesso)' }}>
            <span>✓</span> Solicitação criada! Redirecionando para validação...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="full form-group">
              <label>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Nome do passageiro" />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@exemplo.com" />
            </div>

            <div className="form-group">
              <label>Senha Provisória</label>
              <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha inicial" required minLength={8} />
            </div>

            <div className="full form-group">
              <label>Tipo(s) de Deficiência</label>
              <div className="checkbox-group">
                {opcoesDeficiencia.map((tipo) => (
                  <label key={tipo} className="checkbox-item">
                    <input type="checkbox" checked={formData.tiposDeficiencia.includes(tipo)} onChange={() => handleCheckboxChange(tipo)} />
                    {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Deseja suporte?</label>
              <select name="desejaSuporte" value={formData.desejaSuporte} onChange={(e) => setFormData((prev) => ({ ...prev, desejaSuporte: e.target.value === 'true' }))}>
                <option value="true">Sim, ativar assistência</option>
                <option value="false">Não, manter autonomia</option>
              </select>
            </div>

            <div className="full form-group">
              <p className="form-hint" style={{ marginTop: '1rem', color: 'var(--cor-texto-suave)' }}>
                * No cadastro administrativo, você está criando uma solicitação. 
                Após salvar, você será redirecionado para a tela de Validações para aprovar este usuário.
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/usuarios')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading || sucesso} className="btn-primary">
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
