import React from 'react';
import { useAuth } from '../../auth/useAuth';
import { pcdService } from '../services/pcdService';
import { useFetch } from '../../../core/hooks/useFetch'
import './PcdDashboard.css';

export const PcdDashboardPage = () => {
  const { user } = useAuth();
  
  // 1. Tenta buscar o formulário para saber o status da solicitação
  const { 
    data: formData, 
    loading: loadingForm, 
    erro: erroForm 
  } = useFetch(
    () => pcdService.buscarFormularioAtivo(user.email),
    [user?.email],
    { enabled: !!user?.email }
  );

  // 2. Tenta buscar os dados de PCD ativo (só existirá se estiver aprovado)
  const { 
    data: pcdData, 
    loading: loadingPcd, 
    erro: erroPcd 
  } = useFetch(
    () => pcdService.buscarPcdAtivo(user.email),
    [user?.email],
    { enabled: !!user?.email && formData?.status === 'APROVADO' }
  );

  if (loadingForm || loadingPcd) {
    return (
      <div className="pcd-dashboard-loading">
        <div className="spinner"></div>
        <p>Sincronizando seus dados de acesso...</p>
      </div>
    );
  }

  // Se não encontrar nem formulário nem PCD, algo está errado
  if (erroForm && !formData) {
    return (
      <div className="pcd-dashboard-container">
        <div className="pcd-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#ef4444' }}>Ops! Dados não encontrados</h2>
          <p>Não conseguimos localizar sua solicitação. Por favor, entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  const status = formData?.status || 'PENDENTE';

  return (
    <div className="pcd-dashboard-container">
      <header className="pcd-dashboard-header">
        <h1>Olá, {user?.nome}! </h1>
        <p>Bem-vindo ao seu painel de mobilidade MetroAcesso.</p>
      </header>

      <div className="pcd-dashboard-grid">
        
        {/* Card de Status Geral da Solicitação */}
        <div className={`pcd-card status-card ${status.toLowerCase()}`}>
          <h3>Status da Solicitação</h3>
          <div className="status-display">
            <div className={`status-badge-large ${status.toLowerCase()}`}>
              {status === 'EM_ANALISE' && '⏳ Em Análise'}
              {status === 'APROVADO' && '✅ Aprovada'}
              {status === 'REPROVADO' && '❌ Reprovada'}
              {status === 'PENDENTE' && 'ℹ️ Pendente'}
            </div>
            <p className="status-description">
              {status === 'EM_ANALISE' && 'Sua documentação está sendo revisada por nossa equipe técnica. Você receberá um e-mail assim que o processo for concluído.'}
              {status === 'APROVADO' && 'Sua solicitação foi aprovada! Sua Tag de acesso já está ativa para uso nas estações.'}
              {status === 'REPROVADO' && `Sua solicitação não pôde ser aprovada. Motivo: ${formData?.motivoReprovacao || 'Documentação inconsistente'}.`}
            </p>
          </div>
        </div>

        {/* Card de Tag - Só mostra detalhes se aprovado */}
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
            <div className="tag-info-placeholder">
              <p>{status === 'APROVADO' ? 'Vinculando sua Tag...' : 'A Tag será liberada após a aprovação do seu cadastro.'}</p>
            </div>
          )}
        </div>

        {/* Card de Suporte */}
        <div className="pcd-card support-card">
          <h3>Preferência de Suporte</h3>
          <div className="support-status">
            <span className={`support-badge ${pcdData?.desejaSuporte || formData?.desejaSuporte ? 'yes' : 'no'}`}>
              {(pcdData?.desejaSuporte || formData?.desejaSuporte) ? '✓ Suporte Ativado' : '✗ Sem Suporte'}
            </span>
            <p>
              {(pcdData?.desejaSuporte || formData?.desejaSuporte)
                ? 'Os agentes de atendimento serão notificados quando você aproximar sua Tag nas catracas.'
                : 'Você optou por navegar de forma independente pelas estações.'}
            </p>
          </div>
        </div>

        {/* Card de Ajuda */}
        <div className="pcd-card info-card">
          <h3>Central de Ajuda</h3>
          <ul className="help-list">
            <li><span>📍</span> Estações Acessíveis</li>
            <li><span>📞</span> Contatar Suporte</li>
            <li><span>📄</span> Ver Termos de Uso</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
