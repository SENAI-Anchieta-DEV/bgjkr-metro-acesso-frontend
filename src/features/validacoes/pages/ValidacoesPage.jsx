import React, { useEffect, useState } from 'react';
import { validacoesService } from '../services/validacoesService';
import { tagsService } from '../../tags/services/tagsService';
import { env } from '../../../core/config/env';
import { httpClient } from '../../../core/api/httpClient';
import './ValidacoesPage.css';
import { handleVerComprovacao } from '../../../core/utils/comprovacaoUtils';

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
      await validacoesService.processarValidacao(form.email, true, null);
      setFormularios(prev => prev.filter(f => f.id !== form.id));
      alert('Usuário aprovado com sucesso! Uma Tag foi vinculada automaticamente.');
    } catch (err) {
      const mensagem = err.response?.data?.detail
        ?? err.response?.data?.message
        ?? 'Erro ao processar a aprovação. Tente novamente.';
      alert(mensagem);
    } finally {
      setProcessando(null);
    }
  };

  const handleReject = async (form) => {
    const motivoReprovacao = window.prompt('Digite o motivo da reprovação:');
    console.log('motivoReprovacao:', motivoReprovacao); // ✅
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

  const handleVerComprovacao = async (email) => {
    try {
      const response = await httpClient.get(`/api/formulario/${encodeURIComponent(email)}/comprovacao`, {
        responseType: 'blob',
      });

      const contentType = response.headers['content-type']?.split(';')[0].trim();
      const disposition = response.headers['content-disposition'];

      const nomeBase = disposition
        ?.split('filename=')?.[1]
        ?.replace(/"/g, '')
        ?? 'comprovacao';

      const extensao = contentType !== 'application/octet-stream'
        ? contentType?.split('/')?.[1] ?? ''
        : '';

      const nomeArquivo = extensao && !nomeBase.includes('.')
        ? `${nomeBase}.${extensao}`
        : nomeBase;

      const url = URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nomeArquivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao carregar comprovação de deficiência:', err);
      alert('Não foi possível carregar a comprovação de deficiência.');
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
              <th>Comprovação de Deficiência</th>
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
                      <button
                        className="btn-view"
                        onClick={() => handleVerComprovacao(form.email, (e) => `/api/formulario/${encodeURIComponent(e)}/comprovacao`)}
                      >
                        Comprovação
                      </button>
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












































