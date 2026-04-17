import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../../../core/utils/error';

export const PcdFormPage = () => {
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

  // Enum TipoDeficiencia do Java
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
      // O backend Java usa @ModelAttribute + MultipartFile — precisa de FormData
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
      setErro(getErrorMessage(err, 'Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="cadastro-container" style={{ textAlign: 'center' }}>
        <h2>Solicitação Enviada! 🚇</h2>
        <p>Os seus dados e o laudo médico foram enviados com sucesso.</p>
        <p>
          A nossa equipa irá analisar a documentação. Receberá um e-mail com os próximos passos
          em breve.
        </p>
        <button onClick={() => navigate('/')} className="btn-salvar" style={{ marginTop: '2rem' }}>
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <h2>Solicitação de Acesso PCD</h2>
        <p>Preencha os dados e anexe o seu laudo médico para solicitar o acesso especial.</p>
      </div>

      {erro && <div className="erro-mensagem" style={{ color: 'red', marginBottom: '1rem' }}>{erro}</div>}

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label>Nome Completo</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>E-mail de Contato</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Senha de Acesso</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Crie uma senha de acesso"
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label>Tipo(s) de Deficiência</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {opcoesDeficiencia.map((tipo) => (
              <label
                key={tipo}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}
              >
                <input
                  type="checkbox"
                  checked={formData.tiposDeficiencia.includes(tipo)}
                  onChange={() => handleCheckboxChange(tipo)}
                  style={{ width: 'auto' }}
                />
                {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Deseja suporte dos agentes?</label>
          <select
            name="desejaSuporte"
            value={formData.desejaSuporte}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, desejaSuporte: e.target.value === 'true' }))
            }
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Anexar Laudo Médico (PDF ou Imagem)</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            required
            style={{ border: '1px dashed #cbd5e1', padding: '1rem', cursor: 'pointer' }}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-salvar">
            {loading ? 'A enviar...' : 'Enviar Solicitação'}
          </button>
        </div>
      </form>
    </div>
  );
};