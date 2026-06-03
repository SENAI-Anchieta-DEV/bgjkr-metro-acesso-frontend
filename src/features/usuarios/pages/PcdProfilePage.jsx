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
    email: '',
    desejaSuporte: true,
    senha: '',
    tiposDeficiencia: '',
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
          email: data.email || '',
          desejaSuporte: data.desejaSuporte ?? true,
          senha: '',
          tiposDeficiencia: data.tiposDeficiencia?.join(', ') || '',
        });

      } catch (err) {
        console.error('Erro ao buscar dados do PCD:', err);
        setErro('Não foi possível carregar suas informações.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchPcdData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'desejaSuporte'
          ? value === 'true'
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setSaving(true);

    try {
      const payload = {};

      if (formData.nome?.trim()) payload.nome = formData.nome;
      if (formData.email?.trim()) payload.email = formData.email;
      if (formData.senha?.trim()) payload.senha = formData.senha;

      if (formData.desejaSuporte !== undefined) {
        payload.desejaSuporte = formData.desejaSuporte;
      }

      if (formData.tiposDeficiencia?.trim()) {
        payload.tiposDeficiencia = formData.tiposDeficiencia
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);
      }

      await pcdService.atualizarPcd(user.email, payload);

      setSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/meu-acesso'), 2000);

    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
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
      </header>

      <form onSubmit={handleSubmit} className="profile-form">

        <div className="form-group">
          <label>Nome</label>
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Deseja suporte</label>
          <select
            name="desejaSuporte"
            value={formData.desejaSuporte}
            onChange={handleChange}
            className="form-select"
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tipos de deficiência (separados por vírgula)</label>
          <input
            name="tiposDeficiencia"
            value={formData.tiposDeficiencia}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: VISUAL, AUDITIVA"
          />
        </div>

        <div className="form-group">
          <label>Nova senha</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="form-input"
            placeholder="Opcional"
          />
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <button type="submit" className="btn-salvar" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};