import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestaoUsuariosPage.css';

export const GestaoUsuariosPage = () => {
  const navigate = useNavigate();
  
  // O estado agora começa vazio, aguardando a integração real
  const [usuarios, setUsuarios] = useState([]);

  const getInitials = (nome) => nome ? nome.charAt(0).toUpperCase() : 'U';

  const renderRoleBadge = (role) => {
    switch(role) {
      case 'ADMINISTRADOR': return <span className="role-badge role-admin">Administrador</span>;
      case 'AGENTE_ATENDIMENTO': return <span className="role-badge role-agente">Agente</span>;
      case 'USUARIO_PCD': return <span className="role-badge role-pcd">PCD</span>;
      default: return <span className="role-badge">Desconhecido</span>;
    }
  };

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h2>Gestão de Usuários</h2>
          <p>Gerencie os acessos de Administradores e Agentes do sistema.</p>
        </div>
        <button 
          className="btn-adicionar"
          onClick={() => navigate('/usuarios/novo-agente')}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Adicionar Usuário
        </button>
      </header>

      {/* Cartões de Stats com valores zerados por enquanto */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total de Usuários</span>
          <div className="stat-value">{usuarios.length}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Agentes Ativos</span>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">PCDs Validados</span>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Taxa de Retenção</span>
          <div className="stat-value">--</div>
        </div>
      </div>

      <div className="table-container">
        {usuarios.length > 0 ? (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Função</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
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
                    <div className={`status-badge ${user.ativo ? 'status-ativo' : 'status-inativo'}`}>
                      <span className="status-dot"></span>
                      {user.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" title="Editar">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* AVISO DE LISTA VAZIA */
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" fill="none" stroke="#94A3B8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3>Nenhum usuário encontrado</h3>
            <p>A lista de usuários está vazia ou ainda não foi carregada do servidor.</p>
          </div>
        )}
      </div>
    </div>
  );
};