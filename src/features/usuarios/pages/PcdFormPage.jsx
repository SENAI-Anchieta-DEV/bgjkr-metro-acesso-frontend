import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

export const PcdFormPage = () => {
  const navigate = useNavigate();
  
  // 1. O Estado reflete EXATAMENTE o FormSolicitacaoRequestDto
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tiposDeficiencia: [],
    comprovacaoDeficienciaBase64: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  // Lista de deficiências baseada no teu Enum TipoDeficiencia do Java
  const opcoesDeficiencia = ['FISICA', 'AUDITIVA', 'VISUAL', 'INTELECTUAL', 'MULTIPLA'];

  // Lida com os campos de texto normais
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lida com as Checkboxes (adiciona ou remove da lista)
  const handleCheckboxChange = (tipo) => {
    setFormData(prev => {
      const listaAtual = prev.tiposDeficiencia;
      if (listaAtual.includes(tipo)) {
        return { ...prev, tiposDeficiencia: listaAtual.filter(t => t !== tipo) };
      } else {
        return { ...prev, tiposDeficiencia: [...listaAtual, tipo] };
      }
    });
  };

  // O grande truque: Converte o Arquivo para texto Base64 para o Java aceitar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // O reader devolve algo como: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        // Nós queremos só a parte depois da vírgula para mandar pro Java
        const base64String = reader.result.split(',')[1];
        setFormData(prev => ({ ...prev, comprovacaoDeficienciaBase64: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    if (formData.tiposDeficiencia.length === 0) {
      setErro('Por favor, selecione pelo menos um tipo de deficiência.');
      setLoading(false);
      return;
    }

    if (!formData.comprovacaoDeficienciaBase64) {
      setErro('O laudo médico é obrigatório.');
      setLoading(false);
      return;
    }

    try {
      console.log("Payload exato a ser enviado (sem o base64 gigante para não travar o console):", {
        ...formData,
        comprovacaoDeficienciaBase64: formData.comprovacaoDeficienciaBase64.substring(0, 20) + '...'
      });
      
      // Quando o axios estiver ligado (iremos fazer a rota livre depois)
      // await httpClient.post('/pcd/solicitar', formData);
      
      setSucesso(true);
      
    } catch (error) {
      console.error(error);
      setErro('Erro ao enviar a solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Tela de Sucesso (como o PCD não faz login na hora, ele vê esta tela)
  if (sucesso) {
    return (
      <div className="cadastro-container" style={{ textAlign: 'center' }}>
        <h2>Solicitação Enviada! 🚇</h2>
        <p>Os seus dados e o laudo médico foram enviados com sucesso.</p>
        <p>A nossa equipa irá analisar a documentação. Receberá um e-mail com os próximos passos em breve.</p>
        <button onClick={() => navigate('/login')} className="btn-salvar" style={{ marginTop: '2rem' }}>
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
      
      {erro && <div className="erro-mensagem">{erro}</div>}

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
          <label>Tipo(s) de Deficiência</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {opcoesDeficiencia.map(tipo => (
              <label key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                <input 
                  type="checkbox" 
                  checked={formData.tiposDeficiencia.includes(tipo)}
                  onChange={() => handleCheckboxChange(tipo)}
                  style={{ width: 'auto' }}
                />
                {tipo}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Anexar Laudo Médico (PDF ou Imagem)</label>
          <input 
            type="file" 
            accept=".pdf, image/*" 
            onChange={handleFileChange} 
            required 
            style={{ border: '1px dashed #cbd5e1', padding: '2rem 1rem', cursor: 'pointer' }}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/login')} className="btn-cancelar">
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