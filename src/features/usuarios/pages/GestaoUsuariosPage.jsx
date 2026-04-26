import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import './GestaoUsuariosPage.css';

// ─── Modal de seleção de tipo de usuário ───────────────────────────────────────
const NovoUsuarioModal = ({ onClose, onSelect }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Adicionar Usuário</h3>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <p className="modal-subtitle">Selecione o perfil que deseja cadastrar:</p>
      <div className="modal-options">
        <button className="modal-option admin" onClick={() => onSelect('admin')}>
          <div className="option-icon">🛡️</div>
          <div className="option-info">
            <strong>Administrador</strong>
            <span>Acesso total ao sistema</span>
          </div>
          <svg className="option-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button className="modal-option agente" onClick={() => onSelect('agente')}>
          <div className="option-icon">👤</div>
          <div className="option-info">
            <strong>Agente de Atendimento</strong>
            <span>Funcionário da estação</span>
          </div>
          <svg className="option-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button className="modal-option pcd" onClick={() => onSelect('pcd')}>
          <div className="option-icon">♿</div>
          <div className="option-info">
            <strong>Usuário PCD</strong>
            <span>Passageiro com necessidades especiais</span>
          </div>
          <svg className="option-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
);

// ─── Componente principal ──────────────────────────────────────────────────────
export const GestaoUsuariosPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [removendoEmail, setRemovendoEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState('TODOS');

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      // Busca admins e agentes em paralelo e injeta a role manualmente
      // (a API retorna AdminResponseDto/AgenteResponseDto sem campo role)
      const [admins, agentes] = await Promise.all([
        usuariosService.listarAdmins(),
        usuariosService.listarAgentes(),
        
      ]);

      const adminsComRole = admins.map(u => ({ ...u, role: 'ADMINISTRADOR' }));
      const agentesComRole = agentes.map(u => ({ ...u, role: 'AGENTE_ATENDIMENTO' }));

      setUsuarios([...adminsComRole, ...agentesComRole]);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setErro('Não foi possível carregar os usuários. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleRemover = async (user) => {
    if (!window.confirm(`Deseja remover o usuário "${user.nome}" (${user.email})?`)) return;

    setRemovendoEmail(user.email);
    try {
      if (user.role === 'ADMINISTRADOR') {
        await usuariosService.removerAdmin(user.email);
      } else {
        await usuariosService.removerAgente(user.email);
      }
      setUsuarios(prev => prev.filter(u => u.email !== user.email));
    } catch (err) {
      alert('Erro ao remover usuário. Tente novamente.');
    } finally {
      setRemovendoEmail(null);
    }
  };

  const handleSelecionarTipo = (tipo) => {
    setShowModal(false);
    if (tipo === 'admin') navigate('/usuarios/novo-admin');
    else if (tipo === 'agente') navigate('/usuarios/novo-agente');
    else if (tipo === 'pcd') navigate('/usuarios/novo-pcd');
  };

  const getInitials = (nome) => (nome ? nome.charAt(0).toUpperCase() : 'U');

  const renderRoleBadge = (role) => {
    const config = {
      ADMINISTRADOR: { label: 'Administrador', className: 'role-admin' },
      AGENTE_ATENDIMENTO: { label: 'Agente', className: 'role-agente' },
    };
    const { label, className } = config[role] || { label: 'Desconhecido', className: '' };
    return <span className={`role-badge ${className}`}>{label}</span>;
  };

  const usuariosFiltrados = filtro === 'TODOS'
    ? usuarios
    : usuarios.filter(u => u.role === filtro);

  const totalAdmins = usuarios.filter(u => u.role === 'ADMINISTRADOR').length;
  const totalAgentes = usuarios.filter(u => u.role === 'AGENTE_ATENDIMENTO').length;

  return (
    <>
      {showModal && (
        <NovoUsuarioModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelecionarTipo}
        />
      )}

      <div className="gestao-container">
        {/* Header */}
        <header className="gestao-header">
          <div>
            <h2>Gestão de Usuários</h2>
            <p>Gerencie os acessos de Administradores e Agentes do sistema.</p>
          </div>
          <button className="btn-adicionar" onClick={() => setShowModal(true)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Adicionar Usuário
          </button>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">Total de Usuários</span>
            <div className="stat-value">{loading ? '—' : usuarios.length}</div>
          </div>
          <div className="stat-card">
            <span className="stat-title">Administradores</span>
            <div className="stat-value">
              {loading ? '—' : totalAdmins}
              {!loading && <span className="stat-trend trend-neutral">gestão</span>}
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-title">Agentes Ativos</span>
            <div className="stat-value">
              {loading ? '—' : totalAgentes}
              {!loading && <span className="stat-trend trend-up">atendimento</span>}
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-title">Status do Sistema</span>
            <div className="stat-value" style={{ fontSize: '1rem', color: erro ? '#EF4444' : '#10B981' }}>
              {loading ? 'Carregando...' : erro ? '⚠ Erro' : '✓ Online'}
            </div>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="error-strip">
            {erro}
            <button onClick={carregarUsuarios}>Tentar novamente</button>
          </div>
        )}

        {/* Filtros */}
        <div className="filtros-bar">
          {[
            { key: 'TODOS', label: 'Todos' },
            { key: 'ADMINISTRADOR', label: 'Administradores' },
            { key: 'AGENTE_ATENDIMENTO', label: 'Agentes' },
            { key: 'PCD', label: 'Usuários PCD' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`filtro-btn ${filtro === key ? 'ativo' : ''}`}
              onClick={() => setFiltro(key)}
            >
              {label}
              <span className="filtro-count">
                {key === 'TODOS' ? usuarios.length
                  : key === 'ADMINISTRADOR' ? totalAdmins
                  : totalAgentes}
              </span>
            </button>
          ))}
        </div>

        {/* Tabela */}
        <div className="table-container">
          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner"/>
              <p>Carregando usuários...</p>
            </div>
          ) : usuariosFiltrados.length > 0 ? (
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Função</th>
                  <th>E-mail</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(user => (
                  <tr key={user.id || user.email}>
                    <td>
                      <div className="user-cell">
                        <div className={`user-avatar avatar-${user.role === 'ADMINISTRADOR' ? 'admin' : 'agente'}`}>
                          {getInitials(user.nome)}
                        </div>
                        <span className="user-name">{user.nome}</span>
                      </div>
                    </td>
                    <td>{renderRoleBadge(user.role)}</td>
                    <td><span className="user-email">{user.email}</span></td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon btn-delete"
                          title="Remover usuário"
                          disabled={removendoEmail === user.email}
                          onClick={() => handleRemover(user)}
                        >
                          {removendoEmail === user.email ? (
                            <span style={{ fontSize: '0.7rem' }}>...</span>
                          ) : (
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3>Nenhum usuário encontrado</h3>
              <p>
                {filtro === 'TODOS'
                  ? 'A lista está vazia. Clique em "Adicionar Usuário" para começar.'
                  : `Nenhum ${filtro === 'ADMINISTRADOR' ? 'administrador' : 'agente'} cadastrado ainda.`}
              </p>
              <button className="btn-adicionar" style={{ marginTop: '16px' }} onClick={() => setShowModal(true)}>
                + Adicionar Usuário
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};