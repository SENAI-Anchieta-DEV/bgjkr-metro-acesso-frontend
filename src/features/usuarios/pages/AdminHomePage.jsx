import React from 'react';
import { MetroMap } from '../../dashboard/components/MetroMap';
import './AdminHomePage.css';

export const AdminHomePage = () => {
  return (
    <div className="admin-home-container">
      <header className="admin-home-header">
        <h1>Central de Monitoramento</h1>
        <p>Visão geral da rede e status das estações em tempo real.</p>
      </header>
      
      <div className="admin-map-section">
        <MetroMap />
      </div>
    </div>
  );
};