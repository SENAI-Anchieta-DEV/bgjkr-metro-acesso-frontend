import React, { useEffect, useState } from 'react';
import { validacoesService } from '../services/validacoesService';
import { tagsService } from '../../tags/services/tagsService';
import { env } from '../../../core/config/env';
import './ValidacoesPage.css';

export default function ValidacoesPage() {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [tagsDisponiveis, setTagsDisponiveis] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [loadingTags, setLoadingTags] = useState(false);

  const carregarDados = async () => {
    setLoading(true);
    setErro('');
    try {
      const dados = await validacoesService.buscarPendentes();
      setFormularios(dados);
    } catch {
      setErro('Não foi possível carregar a fila de validações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleApprovalClick = async (form) => {
    setSelectedForm(form);
    setSelectedTag('');
    setLoadingTags(true);
    try {
      const tags = await tagsService.listarDisponiveis();
      setTagsDisponiveis(tags);
    } catch (err) {
      console.error('Erro ao carregar tags:', err);
      setErro('Erro ao carregar tags disponíveis.');
    } finally {
      setLoadingTags(false);
    }
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedTag) {
      alert('Selecione uma Tag RFID para vincular ao usuário.');
      return;
    }

    setProcessando(selectedForm.id);
    try {
      await validacoesService.processarValidacao(selectedForm.email, true, null, selectedTag);
      setFormularios(prev => prev.filter(f => f.id !== selectedForm.id));
      setShowApprovalModal(false);
      alert('Usuário aprovado com sucesso!');
    } catch (err) {
      console.error('Erro ao aprovar:', err);
      alert('Erro ao processar a aprovação. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  };

  const handleReject = async (form) => {
    const motivoReprovacao = window.prompt('Digite o motivo da reprovação:');
    if (!motivoReprovacao || !motivoReprovacao.trim()) return;

    setProcessando(form.id);
    try {
      await validacoesService.processarValidacao(form.email, false, motivoReprovacao);
      setFormularios(prev => prev.filter(f => f.id !== form.id));
      alert('Solicitação reprovada.');
    } catch (err) {
      console.error('Erro ao reprovar:', err);
      alert('Erro ao processar a decisão. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Carregando fila de validações...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Fila de Validações PCD</h1>
        <p>
          {formularios.length === 0
            ? 'Nenhuma solicitação pendente.'
            : `${formularios.length} solicitação(ões) aguardando análise.`}
        </p>
      </div>

      {erro && (
        <div className="error-banner">
          {erro}
          <button onClick={carregarDados} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Deficiência(s)</th>
              <th>Suporte</th>
              <th>Laudo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formularios.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Nenhuma pendência encontrada.
                </td>
              </tr>
            ) : (
              formularios.map((form) => (
                <tr key={form.id}>
                  <td>{form.nome}</td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{form.email}</td>
                  <td>
                    {Array.isArray(form.tiposDeficiencia)
                      ? form.tiposDeficiencia.map(t => (
                          <span key={t} className="badge-info" style={{ marginRight: '4px' }}>
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                          </span>
                        ))
                      : <span className="badge-info">—</span>
                    }
                  </td>
                  <td>{form.desejaSuporte ? 'Sim' : 'Não'}</td>
                  <td>
                    {form.comprovacaoId ? (
                      <a
                        href={`${env.apiBaseUrl}/upload/${form.comprovacaoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view"
                      >
                        Ver laudo
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Sem arquivo</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-approve"
                      disabled={processando === form.id}
                      onClick={() => handleApprovalClick(form)}
                    >
                      {processando === form.id ? '...' : 'Aprovar'}
                    </button>
                    <button
                      className="btn-reject"
                      disabled={processando === form.id}
                      onClick={() => handleReject(form)}
                    >
                      {processando === form.id ? '...' : 'Reprovar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showApprovalModal && (
        <div className="modal-backdrop" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Aprovar Solicitação PCD</h3>
              <button className="modal-close" onClick={() => setShowApprovalModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              <p className="modal-subtitle">Selecione a Tag RFID para vincular ao usuário:</p>
              <p className="modal-user-info"><strong>{selectedForm?.nome}</strong> ({selectedForm?.email})</p>
              
              {loadingTags ? (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>Carregando tags disponíveis...</p>
              ) : tagsDisponiveis.length === 0 ? (
                <p style={{ color: '#ef4444', textAlign: 'center' }}>Nenhuma tag disponível no sistema.</p>
              ) : (
                <select 
                  value={selectedTag} 
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="modal-select"
                >
                  <option value="">Selecione uma tag...</option>
                  {tagsDisponiveis.map(tag => (
                    <option key={tag.codigoTag} value={tag.codigoTag}>
                      {tag.codigoTag}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowApprovalModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-approve" 
                onClick={handleConfirmApproval}
                disabled={!selectedTag || loadingTags}
              >
                Confirmar Aprovação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}