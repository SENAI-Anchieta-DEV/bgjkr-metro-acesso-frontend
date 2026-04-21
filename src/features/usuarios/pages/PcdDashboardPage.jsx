import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { pcdService } from '../services/pcdService';
import './PcdDashboard.css';

export const PcdDashboardPage = () => {
  const { user } = useAuth();
  const [pcdData, setPcdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchPcdData = async () => {
      try {
        const data = await pcdService.buscarPcdAtivo(user.email);
        setPcdData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do PCD:', err);
        setErro('Não foi possível carregar as informações da sua Tag.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchPcdData();
    }
  }, [user]);

  if (loading) return <div className="pcd-dashboard-loading">Carregando seus dados de acesso...</div>;
  
  if (erro) return <div className="pcd-dashboard-loading" style={{ color: '#ef4444' }}>{erro}</div>;

  return (
    <div className="pcd-dashboard-container">
      <header className="pcd-dashboard-header">
        <h1>Olá, {user?.nome}! 🚇</h1>
        <p>Bem-vindo ao seu painel de mobilidade MetroAcesso.</p>
      </header>

      <div className="pcd-dashboard-grid">
        {/* Card de Status da Tag */}
        <div className="pcd-card tag-status-card">
          <h3>Sua Tag de Acesso</h3>
          {pcdData?.tag?.codigoTag ? (
            <div className="tag-info">
              <div className="tag-icon">🆔</div>
              <div className="tag-details">
                <span className="tag-label">Código Ativo:</span>
                <span className="tag-code">{pcdData.tag.codigoTag}</span>
              </div>
              <div className="tag-badge status-active">Ativa</div>
            </div>
          ) : (
            <div className="tag-info status-pending">
              <p>Sua Tag ainda está sendo processada ou não foi vinculada.</p>
            </div>
          )}
        </div>

        {/* Card de Suporte */}
        <div className="pcd-card support-card">
          <h3>Preferência de Suporte</h3>
          <div className="support-status">
            <span className={`support-badge ${pcdData?.desejaSuporte ? 'yes' : 'no'}`}>
              {pcdData?.desejaSuporte ? '✓ Suporte Ativado' : '✗ Sem Suporte'}
            </span>
            <p>
              {pcdData?.desejaSuporte 
                ? 'Os agentes de atendimento serão notificados quando você aproximar sua Tag nas catracas.' 
                : 'Você optou por navegar de forma independente pelas estações.'}
            </p>
          </div>
        </div>

        {/* Card de Dicas/Info */}
        <div className="pcd-card info-card">
          <h3>Como usar?</h3>
          <ul>
            <li>Aproxime sua Tag do sensor na catraca adaptada.</li>
            <li>Aguarde a sinalização verde para passar.</li>
            <li>Em caso de problemas, procure um agente de atendimento.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};