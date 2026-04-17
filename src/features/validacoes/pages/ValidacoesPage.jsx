import React, { useEffect, useState } from 'react';
import { validacoesService } from '../services/validacoesService';
import '../../../styles/Admin.css'; 
import { env } from '../../../core/config/env';


export default function ValidacoesPage() {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Função para carregar os dados do Java
  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await validacoesService.buscarPendentes();
      setFormularios(dados);
    } catch (err) {
      setErro("Não foi possível carregar a fila de validações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Função para Aprovar ou Reprovar
  const handleDecisao = async (id, aprovado) => {
    const motivo = aprovado ? "" : prompt("Digite o motivo da reprovação:");
    
    if (!aprovado && !motivo) return; // Cancela se não der motivo na reprovação

    try {
      await validacoesService.processarValidacao({
        idFormulario: id,
        aprovado: aprovado,
        motivoReprovacao: motivo
      });
      
      // Remove da lista local após processar com sucesso
      setFormularios(formularios.filter(f => f.id !== id));
      alert(aprovado ? "Usuário aprovado com sucesso!" : "Usuário reprovado.");
    } catch (err) {
      alert("Erro ao processar a decisão no servidor.");
    }
  };

  if (loading) return <div className="loading-state">Carregando fila de acesso...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Fila de Validações PcD</h1>
        <p>Existem {formularios.length} solicitações aguardando análise.</p>
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome Completo</th>
              <th>Deficiência</th>
              <th>Data Solicitação</th>
              <th>Documento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formularios.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma pendência encontrada.
                </td>
              </tr>
            ) : (
              formularios.map((form) => (
                <tr key={form.id}>
                  <td>#{form.id}</td>
                  <td>{form.nomeCompleto}</td>
                  <td><span className="badge-info">{form.tipoDeficiencia}</span></td>
                  <td>{new Date(form.dataSolicitacao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <a href={`${env.apiBaseUrl}/${form.caminhoComprovante}`} target="_blank" rel="noreferrer" className="btn-view">
                      Ver Laudo
                    </a>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-approve" 
                      onClick={() => handleDecisao(form.id, true)}
                    >
                      Aprovar
                    </button>
                    <button 
                      className="btn-reject" 
                      onClick={() => handleDecisao(form.id, false)}
                    >
                      Reprovar
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