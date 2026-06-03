import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../auth/useAuth';
import { pcdService } from '../services/pcdService';
import './PcdDashboard.css';

export const PcdDashboardPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [pcdData, setPcdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const fetchData = useCallback(async () => {
    if (!user?.email) return;

    try {
      // 1. Tenta buscar o formulário — pode não existir se foi cadastrado pelo admin
      let form = null;
      try {
        form = await pcdService.buscarFormularioAtivo(user.email);
        setFormData(form);
      } catch {
        // Sem formulário — PcD cadastrado diretamente pelo admin, tudo bem
        setFormData(null);
      }

      // 2. Busca os dados do PcD sempre (formulário ou não)
      const pcd = await pcdService.buscarPcdAtivo(user.email);
      setPcdData(pcd);

      setErro('');
    } catch (err) {
      setErro(err?.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchData();
    // Polling a cada 30s para refletir mudanças de status sem reload manual
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="pcd-dashboard-loading">
        <div className="spinner"></div>
        <p>Sincronizando seus dados de acesso...</p>
      </div>
    );
  }

  if (erro && !formData) {
    return (
      <div className="pcd-dashboard-container">
        <div className="pcd-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#ef4444' }}>Ops! Dados não encontrados</h2>
          <p>Não conseguimos localizar sua solicitação. Por favor, entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  const status = formData?.status ?? (pcdData ? 'APROVADO' : 'PENDENTE');

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
              {(pcdData?.desejaSuporte ?? formData?.desejaSuporte) ? '✓ Suporte Ativado' : '✗ Sem Suporte'}
            </span>
            <p>
              {(pcdData?.desejaSuporte ?? formData?.desejaSuporte)
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