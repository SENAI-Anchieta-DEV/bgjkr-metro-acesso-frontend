import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/useAuth';
import { monitoramentoService } from '../../sensores/services/monitoramentoService';
import { getErrorMessage } from '../../../core/utils/error';
import './AgenteDashboardPage.css';

export const AgenteDashboardPage = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.codigoEstacao) return;

    try {
      const [alertasData, acessosData] = await Promise.all([
        monitoramentoService.buscarAlertas(user.codigoEstacao),
        monitoramentoService.buscarAcessosRecentes(user.codigoEstacao)
      ]);
      setAlertas(alertasData);
      setAcessos(acessosData);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar dados do monitoramento'));
    } finally {
      setLoading(false);
    }
  }, [user?.codigoEstacao]);

  useEffect(() => {
    fetchData();
    // Atualiza os dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleConcluirAtendimento = async (acessoId) => {
    try {
      await monitoramentoService.concluirAtendimento(acessoId);
      // Atualiza a lista localmente para resposta imediata
      setAlertas(prev => prev.filter(alerta => alerta.id !== acessoId));
    } catch (err) {
      alert(getErrorMessage(err, 'Erro ao concluir atendimento'));
    }
  };

  if (loading && !alertas.length && !acessos.length) {
    return <div className="agente-dashboard-container">Carregando monitoramento...</div>;
  }

  return (
    <div className="agente-dashboard-container">
      <header className="agente-header">
        <div>
          <h1>Painel de Monitoramento</h1>
          <p>Olá, {user?.nome}. Acompanhe os acessos em tempo real.</p>
        </div>
        <div className="estacao-badge">
          Estação: {user?.nomeEstacao || user?.codigoEstacao || 'Não vinculada'}
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        {/* Central de Alertas */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Central de Alertas</h2>
            {alertas.length > 0 && <span className="alert-count">{alertas.length}</span>}
          </div>

          <div className="cards-list">
            {alertas.length === 0 ? (
              <p className="empty-state">Nenhum alerta de suporte no momento.</p>
            ) : (
              alertas.map(alerta => (
                <div key={alerta.id} className={`alerta-card ${alerta.desejaSuporte ? 'urgente' : ''}`}>
                  <div className="alerta-info">
                    <h3>{alerta.nomeUsuario}</h3>
                    <p><strong>Tipo:</strong> {alerta.tipoDeficiencia || 'Não informado'}</p>
                    <p><strong>Status:</strong> {alerta.desejaSuporte ? '⚠️ SOLICITOU SUPORTE' : 'Entrada na estação'}</p>
                    <p className="presenca-time">{new Date(alerta.dataHora).toLocaleTimeString()}</p>
                  </div>
                  <button 
                    className="btn-concluir"
                    onClick={() => handleConcluirAtendimento(alerta.id)}
                  >
                    Concluir
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Painel de Presença */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Presença (Últimos 30 min)</h2>
          </div>

          <div className="cards-list">
            {acessos.length === 0 ? (
              <p className="empty-state">Nenhum acesso registrado recentemente.</p>
            ) : (
              acessos.map(acesso => (
                <div key={acesso.id} className="presenca-item">
                  <div className="user-info">
                    <span className="user-name">{acesso.nomeUsuario}</span>
                    <span className="user-tag">TAG: {acesso.codigoTag}</span>
                  </div>
                  <span className="presenca-time">
                    {new Date(acesso.dataHora).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};