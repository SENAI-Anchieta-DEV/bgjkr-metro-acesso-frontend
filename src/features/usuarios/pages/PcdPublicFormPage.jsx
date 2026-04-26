import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pcdForm.css';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../../../core/utils/error';

export const PcdPublicFormPage = () => {
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
    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(err, 'Ocorreu um erro ao processar sua solicitação.'));
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="pcd-public-container">
        <div className="pcd-public-card success-card">
          <div className="success-icon">✓</div>
          <h2>Solicitação Enviada!</h2>
          <p>
            Recebemos seus dados e o laudo médico com sucesso.
          </p>
          <div className="success-info-box">
            <p>
              <strong>O que acontece agora?</strong>{"\n\n"}
              • Nossa equipe analisará sua documentação.{"\n\n"}
              • Você receberá um e-mail com a confirmação em breve.{"\n\n"}
              • Após aprovado, você poderá acessar o sistema normalmente.
            </p>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary">
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pcd-public-container">
      <div className="pcd-public-card">
        <div className="pcd-public-header">
          <h2>Solicitar Acesso PCD</h2>
          <p>Preencha os dados abaixo para solicitar seu acesso especial às estações.</p>
        </div>

        {erro && <div className="erro"><span>⚠️</span> {erro}</div>}

        <form onSubmit={handleSubmit} className="pcd-public-form">
          <div className="grid">
            <div className="full form-group">
              <label>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome completo" />
            </div>

            <div className="full form-group">
              <label>E-mail de Contato</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="exemplo@email.com" />
            </div>

            <div className="full form-group">
              <label>Senha de Acesso</label>
              <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Mínimo 8 caracteres" required minLength={8} />
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

            <div className="full form-group">
              <label>Deseja suporte dos agentes?</label>
              <select name="desejaSuporte" value={formData.desejaSuporte} onChange={(e) => setFormData((prev) => ({ ...prev, desejaSuporte: e.target.value === 'true' }))}>
                <option value="true">Sim, desejo assistência</option>
                <option value="false">Não, prefiro autonomia</option>
              </select>
            </div>

            <div className="full form-group">
              <label>Anexar Laudo Médico (PDF ou Imagem)</label>
              <div className="file-upload-wrapper">
                <div className="file-upload-text">
                  <span>{comprovacao ? '📄 ' + comprovacao.name : '📁 Selecionar arquivo'}</span>
                </div>
                <input type="file" accept=".pdf,image/*" onChange={handleFileChange} required />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};