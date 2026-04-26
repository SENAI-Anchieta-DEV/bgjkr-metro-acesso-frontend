import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { estacoesService } from '../services/estacoesService';
import './GestaoEstacoesPage.css';
import '../../usuarios/pages/GestaoUsuariosPage.css';

export const GestaoEstacoesPage = () => {
  const navigate = useNavigate();
  const [estacoes, setEstacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandida, setExpandida] = useState(null);

  const carregarEstacoes = async () => {
    try {
      const dados = await estacoesService.listarTodas();
      setEstacoes(dados);
    } catch (err) {
      console.error('Erro ao carregar estações', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEstacoes();
  }, []);

  const handleExcluir = async (codigo, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir a estação ${nome}?`)) {
      try {
        await estacoesService.remover(codigo);
        setEstacoes(prev => prev.filter(e => e.codigoEstacao !== codigo));
      } catch (err) {
        alert('Erro ao excluir estação. Verifique se existem agentes ou sensores vinculados.');
      }
    }
  };

  const getLinhaColorClass = (linha) => {
    const map = {
      'AZUL': 'linha-1',
      'VERDE': 'linha-2',
      'VERMELHA': 'linha-3',
      'AMARELA': 'linha-4',
      'LILAS': 'linha-5',
      'PRATA': 'linha-15'
    };
    return map[linha] || 'linha-default';
  };

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h2>Gestão de Estações</h2>
          <p>Controle de estações, linhas e infraestrutura de hardware.</p>
        </div>
        <button className="btn-adicionar" onClick={() => navigate('/estacoes/nova')}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nova Estação
        </button>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Código</th>
              <th>Nome da Estação</th>
              <th>Linhas</th>
              <th style={{ textAlign: 'center' }}>Agentes</th>
              <th style={{ textAlign: 'center' }}>Sensores</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="loading-cell">Carregando estações...</td></tr>
            ) : estacoes.length === 0 ? (
              <tr><td colSpan="7" className="empty-cell">Nenhuma estação cadastrada.</td></tr>
            ) : (
              estacoes.map((estacao) => (
                <React.Fragment key={estacao.codigoEstacao}>
                  <tr 
                    onClick={() => setExpandida(expandida === estacao.codigoEstacao ? null : estacao.codigoEstacao)}
                    className={expandida === estacao.codigoEstacao ? 'row-active' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ textAlign: 'center', color: 'var(--cor-primaria)' }}>
                      {expandida === estacao.codigoEstacao ? '▼' : '▶'}
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--cor-primaria)' }}>{estacao.codigoEstacao}</td>
                    <td>{estacao.nome}</td>
                    <td>
                      <div className="badge-container">
                        {estacao.linhas?.map(linha => (
                          <span key={linha} className={`badge-linha-small ${getLinhaColorClass(linha)}`}>
                            {linha}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="count-badge">{estacao.agentes?.length || 0}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="count-badge">{estacao.sensores?.length || 0}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon btn-edit"
                          title="Editar estação"
                          onClick={() => navigate(`/estacoes/editar/${estacao.codigoEstacao}`)}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          title="Remover estação"
                          onClick={() => handleExcluir(estacao.codigoEstacao, estacao.nome)}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandida === estacao.codigoEstacao && (
                    <tr className="expansion-row">
                      <td colSpan="7">
                        <div className="expansion-content">
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            <div className="expansion-section">
                              <h4>👨‍💼 Agentes Vinculados</h4>
                              {estacao.agentes?.length > 0 ? (
                                <ul className="expansion-list">
                                  {estacao.agentes.map(a => (
                                    <li key={a.email}>
                                      <strong>{a.nome}</strong> — {a.email}
                                    </li>
                                  ))}
                                </ul>
                              ) : <p className="empty-text">Nenhum agente vinculado a esta estação.</p>}
                            </div>
                            <div className="expansion-section">
                              <h4>📡 Sensores RFID</h4>
                              {estacao.sensores?.length > 0 ? (
                                <ul className="expansion-list">
                                  {estacao.sensores.map(s => (
                                    <li key={s.codigoIdentificador}>
                                      <strong>{s.codigoIdentificador}</strong> — {s.localizacao}
                                    </li>
                                  ))}
                                </ul>
                              ) : <p className="empty-text">Nenhum sensor instalado nesta estação.</p>}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};