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
    } catch (err) { console.error('Erro ao carregar estações', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregarEstacoes(); }, []);

  const handleExcluir = async (codigo, nome) => {
    if (window.confirm(`Excluir a estação ${nome}?`)) {
      try {
        await estacoesService.remover(codigo);
        setEstacoes(prev => prev.filter(e => e.codigoEstacao !== codigo));
      } catch (err) { alert('Erro ao excluir estação.'); }
    }
  };

  return (
    <div className="gestao-container">
      <header className="gestao-header">
        <div>
          <h1>Gestão de Estações</h1>
          <p>Inventário de locais, hardware e agentes.</p>
        </div>
        <button className="btn-add" onClick={() => navigate('/estacoes/nova')}>+ Nova Estação</button>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Código</th>
              <th>Nome</th>
              <th>Linha(s)</th>
              <th>Agentes</th>
              <th>Sensores</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Carregando...</td></tr>
            ) : (
              estacoes.map((estacao) => (
                <React.Fragment key={estacao.codigoEstacao}>
                  <tr onClick={() => setExpandida(expandida === estacao.codigoEstacao ? null : estacao.codigoEstacao)} style={{ cursor: 'pointer' }}>
                    <td>{expandida === estacao.codigoEstacao ? '▼' : '▶'}</td>
                    <td style={{ color: 'var(--cor-primaria)', fontWeight: 'bold' }}>{estacao.codigoEstacao}</td>
                    <td>{estacao.nome}</td>
                    <td>{estacao.linhas?.join(', ')}</td>
                    <td>{estacao.agentes?.length || 0}</td>
                    <td>{estacao.sensores?.length || 0}</td>
                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button className="btn-edit" onClick={() => navigate(`/estacoes/editar/${estacao.codigoEstacao}`)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleExcluir(estacao.codigoEstacao, estacao.nome)}>Excluir</button>
                    </td>
                  </tr>
                  {expandida === estacao.codigoEstacao && (
                    <tr className="expansion-row">
                      <td colSpan="7">
                        <div className="expansion-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
                          <div>
                            <h4>👨‍💼 Agentes</h4>
                            {estacao.agentes?.length > 0 ? (
                              <ul>{estacao.agentes.map(a => <li key={a.email}>{a.nome} ({a.email})</li>)}</ul>
                            ) : <p>Nenhum agente.</p>}
                          </div>
                          <div>
                            <h4>📡 Sensores RFID</h4>
                            {estacao.sensores?.length > 0 ? (
                              <ul>{estacao.sensores.map(s => <li key={s.codigoIdentificador}>{s.codigoIdentificador} - {s.localizacao}</li>)}</ul>
                            ) : <p>Nenhum sensor.</p>}
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
