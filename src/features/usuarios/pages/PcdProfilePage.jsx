import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { pcdService } from '../services/pcdService';
import { useNavigate } from 'react-router-dom';
import './PcdProfile.css';

const TIPOS_DEFICIENCIA = [
  'VISUAL', 'AUDITIVA', 'MOTORA'
];

export const PcdProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pcdData, setPcdData] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    desejaSuporte: true,
    senha: '',
    confirmarSenha: '',
    tiposDeficiencia: [],
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
          desejaSuporte: data.desejaSuporte ?? true,
          senha: '',
          confirmarSenha: '',
          tiposDeficiencia: data.tiposDeficiencia || [],
        });
      } catch (err) {
        setErro('Não foi possível carregar suas informações.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchPcdData();
  }, [user]);

  const toggleDeficiencia = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tiposDeficiencia: prev.tiposDeficiencia.includes(tipo)
        ? prev.tiposDeficiencia.filter(t => t !== tipo)
        : [...prev.tiposDeficiencia, tipo]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (formData.tiposDeficiencia.length === 0) {
      setErro('Selecione ao menos um tipo de deficiência.');
      return;
    }

    setSaving(true);
    try {
      await pcdService.atualizarPcd(user.email, {
        nome: formData.nome,
        senha: formData.senha || null,
        desejaSuporte: formData.desejaSuporte,
        tiposDeficiencia: formData.tiposDeficiencia,
      });
      setSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/meu-acesso'), 2000);
    } catch (err) {
      setErro('Não foi possível atualizar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pcd-profile-loading">Carregando perfil...</div>;
  }

  return (
    <div className="pcd-profile-container">
      <header className="pcd-profile-header">
        <h1>Meu Perfil</h1>
        <p>Visualize e atualize suas informações pessoais.</p>
      </header>

      <div className="pcd-profile-content">

        {/* Informações somente leitura */}
        <div className="profile-section">
          <h2>📋 Informações da Conta</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <div className="info-value">{pcdData?.email}</div>
            </div>
            <div className="info-item">
              <label>Tag vinculada</label>
              <div className="info-value">
                {pcdData?.tag ? pcdData.tag.codigoTag : 'Nenhuma tag vinculada'}
              </div>
            </div>
            <div className="info-item">
              <label>Comprovante</label>
              <div className="info-value">
                {pcdData?.comprovacaoId ? '✅ Enviado' : '❌ Não enviado'}
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de edição */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>✏️ Editar Informações</h2>

            <div className="form-group">
              <label>Nome</label>
              <input
                name="nome"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Deseja suporte presencial</label>
              <select
                name="desejaSuporte"
                value={formData.desejaSuporte}
                onChange={e => setFormData({ ...formData, desejaSuporte: e.target.value === 'true' })}
                className="form-select"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tipos de deficiência</label>
              <div className="checkbox-group">
                {TIPOS_DEFICIENCIA.map(tipo => (
                  <label key={tipo} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.tiposDeficiencia.includes(tipo)}
                      onChange={() => toggleDeficiencia(tipo)}
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Nova senha <span style={{ color: 'var(--cor-texto-suave)', fontWeight: 400 }}>(opcional)</span></label>
              <input
                type="password"
                value={formData.senha}
                onChange={e => setFormData({ ...formData, senha: e.target.value })}
                className="form-input"
                placeholder="Deixe em branco para manter a atual"
              />
            </div>

            {formData.senha && (
              <div className="form-group">
                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={e => setFormData({ ...formData, confirmarSenha: e.target.value })}
                  className="form-input"
                  placeholder="Repita a nova senha"
                />
              </div>
            )}

            {erro && <div className="alert alert-error">{erro}</div>}
            {sucesso && <div className="alert alert-success">{sucesso}</div>}

            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={() => navigate('/meu-acesso')}>
                Cancelar
              </button>
              <button type="submit" className="btn-salvar" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};