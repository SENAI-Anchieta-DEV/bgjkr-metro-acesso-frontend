import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tagsService } from '../services/tagsService';
import '../../usuarios/pages/GestaoUsuariosPage.css';
import './GestaoTagsPage.css';

export const GestaoTagsPage = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarTags = async () => {
    try {
      const dados = await tagsService.listarTodas();
      setTags(dados);
    } catch (err) { console.error('Erro ao carregar tags', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregarTags(); }, []);

  const handleExcluir = async (codigo) => {
    if (window.confirm(`Remover a tag ${codigo} do sistema?`)) {
      try {
        await tagsService.remover(codigo);
        setTags(prev => prev.filter(t => t.codigoTag !== codigo));
      } catch (err) { alert('Erro ao excluir tag.'); }
    }
  };

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h2>Gestão de Tags RFID</h2>
          <p>Controle de dispositivos de acesso e vinculação com usuários PCD.</p>
        </div>
        <button className="btn-adicionar" onClick={() => navigate('/tags/nova')}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nova Tag
        </button>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Código da Tag (UID)</th>
              <th>Usuário Vinculado</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Sincronizando...</td></tr>
            ) : tags.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhuma tag encontrada.</td></tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.codigoTag}>
                  <td style={{ color: 'var(--cor-primaria)', fontWeight: 'bold' }}>{tag.codigoTag}</td>
                  <td>
                    {tag.usuarioPcd ? (
                      <div>
                        <strong>{tag.usuarioPcd.nome}</strong>  

                        <small style={{ color: '#94a3b8' }}>{tag.usuarioPcd.email}</small>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Disponível</span>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: tag.usuarioPcd ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: tag.usuarioPcd ? '#10b981' : '#f59e0b'
                    }}>
                      {tag.usuarioPcd ? 'VINCULADA' : 'LIVRE'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn-icon btn-edit"
                        title="Editar tag"
                        onClick={() => navigate(`/tags/editar/${tag.codigoTag}`)}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        title="Remover tag"
                        onClick={() => handleExcluir(tag.codigoTag)}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};