import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import { getErrorMessage } from '../../../core/utils/error';
import './Cadastro.css';

export const AdminFormPage = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const isEdit = !!email;
  const emailDecoded = email ? decodeURIComponent(email) : '';

  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // NOVO: guarda e-mail original para detectar mudança
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    if (isEdit) {
      usuariosService.buscarAdmin(emailDecoded)
        .then(dados => {
          setFormData({ nome: dados.nome, email: dados.email, senha: '' });
          setOriginalEmail(dados.email); // NOVO
        })
        .catch(() => setErro('Não foi possível carregar os dados do administrador.'));
    }
  }, [emailDecoded]);

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
        const payload = { nome: formData.nome, email: formData.email };
        if (formData.senha) payload.senha = formData.senha;

        await usuariosService.atualizarAdmin(emailDecoded, payload);

        alert('Administrador atualizado com sucesso!');

        // NOVO: força logout se alterou o próprio email
        if (formData.email !== originalEmail) {
          localStorage.removeItem('token'); // ajuste se usar outro nome
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

      } else {
        await usuariosService.cadastrarAdmin(formData);
        alert('Administrador cadastrado com sucesso!');
      }

      navigate('/usuarios');
    } catch (err) {
      console.error(err);
      setErro(getErrorMessage(err, isEdit ? 'Erro ao atualizar administrador.' : 'Erro ao cadastrar administrador.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <div className="cadastro-badge admin">Administrador</div>
        <h2>{isEdit ? 'Editar Administrador' : 'Novo Administrador'}</h2>
        <p>{isEdit ? 'Atualize os dados do administrador.' : 'Preencha os dados para criar um novo acesso de gestão completo ao sistema.'}</p>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail Corporativo</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="senha">{isEdit ? 'Nova Senha (deixe em branco para manter)' : 'Senha de Acesso'}</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required={!isEdit}
            minLength={isEdit ? undefined : 8}
            placeholder={isEdit ? 'Deixe em branco para não alterar' : ''}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancelar" onClick={() => navigate('/usuarios')}>Cancelar</button>
          <button type="submit" className="btn-salvar" disabled={loading}>
            {loading ? 'A guardar...' : isEdit ? 'Salvar Alterações' : 'Guardar Administrador'}
          </button>
        </div>
      </form>
    </div>
  );
};