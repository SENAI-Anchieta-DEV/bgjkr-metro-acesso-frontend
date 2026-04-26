import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { pcdService } from '../services/pcdService';
import { useNavigate } from 'react-router-dom';
import './PcdProfile.css';

export const PcdProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pcdData, setPcdData] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    desejaSuporte: true,
    email: '',
    senha: '', // Senha opcional na atualização
    tiposDeficiencia: [],
    codigoTag: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    const fetchPcdData = async () => {
      try {
        const data = await pcdService.buscarPcdAtivo(user.email);
        setPcdData(data);
        setFormData({
          nome: data.nome || '',
          desejaSuporte: data.desejaSuporte !== undefined ? data.desejaSuporte : true,
          email: data.email || '',
          senha: '', // Mantém vazio a menos que queira trocar
          tiposDeficiencia: data.tiposDeficiencia || [],
          codigoTag: data.tag?.codigoTag || ''
        });
      } catch (err) {
        console.error('Erro ao buscar dados do PCD:', err);
        setErro('Não foi possível carregar suas informações.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchPcdData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'desejaSuporte' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setSaving(true);

    try {
      // O backend espera o PcdRequestDto completo.
      // Enviamos os dados preservando os campos que não podem mudar ou que o usuário não editou.
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha || undefined, // Só envia se preenchido
        tiposDeficiencia: formData.tiposDeficiencia,
        desejaSuporte: formData.desejaSuporte,
        codigoTag: formData.codigoTag
      };

      await pcdService.atualizarPcd(user.email, payload);
      setSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/meu-acesso'), 2000);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setErro('Não foi possível atualizar seu perfil. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pcd-profile-loading">Carregando perfil...</div>;

  return (
    <div className="pcd-profile-container">
      <header className="pcd-profile-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações e preferências de acesso</p>
      </header>

      <div className="pcd-profile-content">
        {/* Seção de Informações Básicas (Leitura) */}
        <div className="profile-section">
          <h2>Informações de Acesso</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>E-mail</label>
              <p className="info-value">{pcdData?.email}</p>
            </div>
            <div className="info-item">
              <label>Tipo(s) de Deficiência</label>
              <p className="info-value">
                {pcdData?.tiposDeficiencia?.join(', ') || 'Não informado'}
              </p>
            </div>
            {pcdData?.tag?.codigoTag && (
              <div className="info-item">
                <label>Código da Tag</label>
                <p className="info-value" style={{ fontFamily: 'monospace' }}>
                  {pcdData.tag.codigoTag}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Edição */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Editar Preferências</h2>

            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="desejaSuporte">Preferência de Suporte</label>
              <select
                id="desejaSuporte"
                name="desejaSuporte"
                value={formData.desejaSuporte}
                onChange={handleChange}
                className="form-select"
              >
                <option value="true">Sim, desejo suporte dos agentes</option>
                <option value="false">Não, prefiro navegar independentemente</option>
              </select>
              <p className="form-hint">
                {formData.desejaSuporte
                  ? 'Os agentes serão notificados quando você usar sua Tag.'
                  : 'Você navegará de forma independente pelas estações.'}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="senha">Nova Senha (opcional)</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="form-input"
                placeholder="Deixe em branco para manter a atual"
                minLength={8}
              />
            </div>

            {erro && <div className="alert alert-error">{erro}</div>}
            {sucesso && <div className="alert alert-success">{sucesso}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/meu-acesso')}
                className="btn-cancelar"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-salvar"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>

        {/* Seção de Ações */}
        <div className="profile-section danger-zone">
          <h2>Zona de Risco</h2>
          <p>Estas ações não podem ser desfeitas.</p>
          <button type="button" className="btn-danger" onClick={() => alert('Para desativar sua conta, entre em contato com a administração.')}>
            Desativar Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
};
