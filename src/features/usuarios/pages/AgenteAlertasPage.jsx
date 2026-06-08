import React from 'react';
import '../../../features/validacoes/pages/ValidacoesPage.css';

export const AgenteAlertasPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Alertas da Estação</h1>
        <p>Acompanhe em tempo real os PCDs que entraram na sua estação.</p>
      </div>

      <div className="table-container">
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
          <h3 style={{ color: 'var(--cor-texto-forte)', marginBottom: '0.5rem' }}>Em breve</h3>
          <p style={{ color: 'var(--cor-texto-medio)', fontSize: '0.95rem' }}>
            Esta funcionalidade ainda está sendo desenvolvida na API. Em breve você poderá acompanhar os alertas de PCDs que entrarem na sua estação em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
};