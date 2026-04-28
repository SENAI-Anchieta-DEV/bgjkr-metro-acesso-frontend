import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/useAuth';
import { monitoramentoService } from '../../sensores/services/monitoramentoService';
import { pendenciasService } from '../services/pendenciasService';
import { getErrorMessage } from '../../../core/utils/error';
import './AgenteDashboardPage.css';

export const AgenteDashboardPage = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [acessos, setAcessos] = useState([]);
  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const promises = [];
      
      if (user?.codigoEstacao) {
        promises.push(monitoramentoService.buscarAlertas(user.codigoEstacao));
        promises.push(monitoramentoService.buscarAcessosRecentes(user.codigoEstacao));
      } else {
        promises.push(Promise.resolve([]));
        promises.push(Promise.resolve([]));
      }

      if (user?.email) {
        promises.push(pendenciasService.listarPendenciasDoAgente(user.email));
      } else {
        promises.push(Promise.resolve([]));
      }

      const [alertasData, acessosData, pendenciasData] = await Promise.all(promises);
      
      setAlertas(alertasData);
      setAcessos(acessosData);
      setPendencias(pendenciasData);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar dados do painel'));
    } finally {
      setLoading(false);
    }
  }, [user?.codigoEstacao, user?.email]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleConcluirAlerta = async (acessoId) => {
    try {
      await monitoramentoService.concluirAtendimento(acessoId);
      setAlertas(prev => prev.filter(alerta => alerta.id !== acessoId));
    } catch (err) {
      alert(getErrorMessage(err, 'Erro ao concluir alerta'));
    }
  };

  const handleConcluirPendencia = async (id) => {
    try {
      await pendenciasService.removerPendencia(id);
      setPendencias(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(getErrorMessage(err, 'Erro ao concluir atendimento pendente'));
    }
  };

  if (loading && !alertas.length && !acessos.length && !pendencias.length) {
    return <div className="agente-dashboard-container">Carregando painel do agente...</div>;
  }

  return (
    <div className="agente-dashboard-container">
      <header className="agente-header">
        <div>
          <h1>Painel do Agente</h1>
          <p>Olá, {user?.nome}. Acompanhe os acessos e suas pendências.</p>
        </div>
        <div className="estacao-badge">
          Estação: {user?.nomeEstacao || user?.codigoEstacao || 'Não vinculada'}
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        {/* Minhas Pendências de Atendimento */}
        <section className="dashboard-section full-width">
          <div className="section-header">
            <h2>Minhas Pendências de Atendimento</h2>
            {pendencias.length > 0 && <span className="alert-count blue">{pendencias.length}</span>}
          </div>

          <div className="pendencias-horizontal-list">
            {pendencias.length === 0 ? (
              <p className="empty-state">Você não possui atendimentos pendentes.</p>
            ) : (
              pendencias.map(pendencia => (
                <div key={pendencia.id} className="pendencia-card-mini">
                  <div className="pendencia-header">
                    <h3>{pendencia.pcdAtendido.nome}</h3>
                    {pendencia.pcdAtendido.desejaSuporte && <span className="status-tag urgent">Suporte</span>}
                  </div>
                  <div className="pendencia-body">
                    <p><strong>Estação:</strong> {pendencia.estacao.nome}</p>
                    <p><strong>Entrada:</strong> {pendencia.entrada.codigoEntrada}</p>
                    <p className="time">{new Date(pendencia.dataHora).toLocaleTimeString()}</p>
                  </div>
                  <button 
                    className="btn-concluir-pendencia"
                    onClick={() => handleConcluirPendencia(pendencia.id)}
                  >
                    Concluir
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Central de Alertas da Estação */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Alertas da Estação</h2>
            {alertas.length > 0 && <span className="alert-count">{alertas.length}</span>}
          </div>

          <div className="cards-list">
            {alertas.length === 0 ? (
              <p className="empty-state">Nenhum alerta na estação no momento.</p>
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
                    onClick={() => handleConcluirAlerta(alerta.id)}
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
            <h2>Acessos Recentes</h2>
          </div>

          <div className="cards-list">
            {acessos.length === 0 ? (
              <p className="empty-state">Nenhum acesso recente.</p>
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