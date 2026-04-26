import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tagsService } from '../services/tagsService';
import '../../usuarios/pages/GestaoUsuariosPage.css';

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
          <h1>Gestão de Tags RFID</h1>
          <p>Inventário de dispositivos para identificação de passageiros PCD.</p>
        </div>
        <button className="btn-add" onClick={() => navigate('/tags/nova')}>+ Nova Tag</button>
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
                  <td className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn-edit" onClick={() => navigate(`/tags/editar/${tag.codigoTag}`)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleExcluir(tag.codigoTag)}>Excluir</button>
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
