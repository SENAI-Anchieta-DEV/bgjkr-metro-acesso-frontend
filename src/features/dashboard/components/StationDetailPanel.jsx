import React from 'react';

export const StationDetailPanel = ({ station, onClose }) => {
  return (
    <div className="station-detail-panel">
      <header className="panel-header">
        <div>
          <h2>Estação {station.nome}</h2>
          <small>Linha {station.linha}</small>
        </div>
        <button className="btn-close-panel" onClick={onClose}>&times;</button>
      </header>

      <div className="panel-content">
        <section className="info-section">
          <h3>Agentes na Estação</h3>
          <div className="agentes-list">
            {station.agentes && station.agentes.length > 0 ? (
              station.agentes.map((agente, idx) => (
                <span key={idx} className="agente-tag">{agente}</span>
              ))
            ) : (
              <p className="empty-text">Nenhum agente escalado.</p>
            )}
          </div>
        </section>

        <section className="info-section">
          <h3>PCDs em Trânsito / Aguardando</h3>
          <div className="pcds-list">
            {station.pcds > 0 ? (
              // Mock de lista de PCDs baseado no contador
              Array.from({ length: station.pcds }).map((_, idx) => (
                <div key={idx} className="pcd-item">
                  <span className="pcd-name">Usuário PCD #{1024 + idx}</span>
                  <span className="status-waiting">AGUARDANDO SUPORTE</span>
                </div>
              ))
            ) : (
              <p className="empty-text">Nenhuma solicitação ativa no momento.</p>
            )}
          </div>
        </section>

        <section className="info-section">
          <h3>Estatísticas Rápidas</h3>
          <div className="stats-grid">
            <p><strong>Status:</strong> Operação Normal</p>
            <p><strong>Acessos (última hora):</strong> {Math.floor(Math.random() * 50) + 10}</p>
          </div>
        </section>
      </div>
    </div>
  );
};