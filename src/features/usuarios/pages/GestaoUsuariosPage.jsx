import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../core/api/httpClient';
import './GestaoUsuariosPage.css';

export const GestaoUsuariosPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    setErro('');
    try {
      // Busca admins e agentes em paralelo
      const [adminsRes, agentesRes] = await Promise.all([
        httpClient.get('/api/admin'),
        httpClient.get('/api/agente'),
      ]);

      const admins = adminsRes.data.map((u) => ({ ...u, role: 'ADMINISTRADOR', ativo: true }));
      const agentes = agentesRes.data.map((u) => ({ ...u, role: 'AGENTE_ATENDIMENTO', ativo: true }));
      setUsuarios([...admins, ...agentes]);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setErro('Não foi possível carregar os usuários. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverAdmin = async (email) => {
    if (!confirm(`Remover o administrador ${email}?`)) return;
    try {
      await httpClient.delete(`/api/admin/${email}`);
      setUsuarios((prev) => prev.filter((u) => u.email !== email));
    } catch {
      alert('Erro ao remover o administrador.');
    }
  };

  const handleRemoverAgente = async (email) => {
    if (!confirm(`Remover o agente ${email}?`)) return;
    try {
      await httpClient.delete(`/api/agente/${email}`);
      setUsuarios((prev) => prev.filter((u) => u.email !== email));
    } catch {
      alert('Erro ao remover o agente.');
    }
  };

  const getInitials = (nome) => (nome ? nome.charAt(0).toUpperCase() : 'U');

  const renderRoleBadge = (role) => {
    switch (role) {
      case 'ADMINISTRADOR':
        return <span className="role-badge role-admin">Administrador</span>;
      case 'AGENTE_ATENDIMENTO':
        return <span className="role-badge role-agente">Agente</span>;
      default:
        return <span className="role-badge">Desconhecido</span>;
    }
  };

  const totalAdmins = usuarios.filter((u) => u.role === 'ADMINISTRADOR').length;
  const totalAgentes = usuarios.filter((u) => u.role === 'AGENTE_ATENDIMENTO').length;

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h2>Gestão de Usuários</h2>
          <p>Gerencie os acessos de Administradores e Agentes do sistema.</p>
        </div>
        <button className="btn-adicionar" onClick={() => navigate('/usuarios/novo-agente')}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Usuário
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total de Usuários</span>
          <div className="stat-value">{loading ? '—' : usuarios.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Administradores</span>
          <div className="stat-value">{loading ? '—' : totalAdmins}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Agentes Ativos</span>
          <div className="stat-value">{loading ? '—' : totalAgentes}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Status</span>
          <div className="stat-value" style={{ fontSize: '1rem', color: '#10B981' }}>
            {loading ? 'Carregando...' : erro ? 'Erro' : 'Online'}
          </div>
        </div>
      </div>

      {erro && (
        <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: '8px', padding: '12px 16px', color: '#B91C1C' }}>
          {erro}
          <button onClick={carregarUsuarios} style={{ marginLeft: '12px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="empty-state">
            <p>Carregando usuários...</p>
          </div>
        ) : usuarios.length > 0 ? (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Função</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{getInitials(user.nome)}</div>
                      <div className="user-details">
                        <span className="user-name">{user.nome}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{renderRoleBadge(user.role)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-delete"
                        title="Remover"
                        onClick={() =>
                          user.role === 'ADMINISTRADOR'
                            ? handleRemoverAdmin(user.email)
                            : handleRemoverAgente(user.email)
                        }
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" fill="none" stroke="#94A3B8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3>Nenhum usuário encontrado</h3>
            <p>A lista está vazia. Adicione um administrador ou agente para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};