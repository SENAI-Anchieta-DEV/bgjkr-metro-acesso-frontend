import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { usuariosService } from '../services/usuariosService';
import './AgentedashboardPage.css';

export const AgenteDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agente, setAgente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    usuariosService.buscarAgente(user.email)
      .then(setAgente)
      .catch(() => setErro('Não foi possível carregar seus dados.'))
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Carregando painel...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel do Agente</h1>
        <p>Bem-vindo, {agente?.nome ?? user?.nome}. Gerencie seus atendimentos abaixo.</p>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      {/* Informações do Agente */}
      <div className="table-container" style={{ padding: '2rem' }}>
        <h2 style={{ color: 'var(--cor-texto-forte)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
          Meus Dados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <InfoField label="Nome" value={agente?.nome} />
          <InfoField label="E-mail" value={agente?.email} />
          <InfoField label="Estação Vinculada" value={agente?.estacao?.nome ?? 'Não vinculada'} />
          <InfoField label="Início do Turno" value={agente?.inicioTurno ?? '—'} />
          <InfoField label="Fim do Turno" value={agente?.fimTurno ?? '—'} />
        </div>
      </div>

      {/* Atalhos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <AtalhoCard
          titulo="Pendências de Atendimento"
          descricao="Visualize e conclua os atendimentos PCD pendentes atribuídos a você."
          icone="♿"
          onClick={() => navigate('/agente/pendencias')}
          cor="var(--cor-primaria)"
        />
        <AtalhoCard
          titulo="Alertas da Estação"
          descricao="Acompanhe os alertas de PCDs que entraram na sua estação."
          icone="🔔"
          onClick={() => navigate('/agente/alertas')}
          cor="#F59E0B"
          emBreve
        />
      </div>
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cor-texto-suave)', textTransform: 'uppercase', letterSpacing: '1px' }}>
      {label}
    </span>
    <p style={{ marginTop: '4px', color: 'var(--cor-texto-forte)', fontSize: '0.95rem' }}>
      {value ?? '—'}
    </p>
  </div>
);

const AtalhoCard = ({ titulo, descricao, icone, onClick, cor, emBreve }) => (
  <div
    className="table-container"
    onClick={!emBreve ? onClick : undefined}
    style={{
      padding: '2rem',
      cursor: emBreve ? 'default' : 'pointer',
      transition: 'transform 0.2s',
      opacity: emBreve ? 0.6 : 1,
    }}
    onMouseEnter={e => { if (!emBreve) e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icone}</div>
    <h3 style={{ color: cor, fontWeight: 700, marginBottom: '0.5rem' }}>
      {titulo} {emBreve && <span style={{ fontSize: '0.7rem', color: 'var(--cor-texto-suave)', fontWeight: 400 }}>(em breve)</span>}
    </h3>
    <p style={{ color: 'var(--cor-texto-medio)', fontSize: '0.9rem' }}>{descricao}</p>
  </div>
);