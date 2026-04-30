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

  const handleApprove = async (form) => {
    if (!window.confirm(`Aprovar a solicitação de ${form.nome}?`)) return;














    setProcessando(form.id);






    try {
      // O back-end original NÃO aceita codigoTag aqui. 
      // Ele escolhe uma tag automaticamente no service.
      await validacoesService.processarValidacao(form.email, true, null);
      setFormularios(prev => prev.filter(f => f.id !== form.id));
      alert('Usuário aprovado com sucesso! Uma Tag foi vinculada automaticamente.');
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
                      onClick={() => handleApprove(form)}
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




   </div>
  );
}












































