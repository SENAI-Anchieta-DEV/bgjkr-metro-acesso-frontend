import React, { useState, useEffect, useCallback } from 'react';
import { pendenciasService } from '../services/pendenciasService';
import { useAuth } from '../../auth/useAuth';
import { getErrorMessage } from '../../../core/utils/error';
import '../../../features/validacoes/pages/ValidacoesPage.css';

export const AgentePendenciasPage = () => {
    const { user } = useAuth();
    const [pendencias, setPendencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [processando, setProcessando] = useState(null);

    const carregarDados = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        setErro('');
        try {
            const dados = await pendenciasService.listarPendenciasDoAgente(user.email);
            setPendencias(dados);
        } catch {
            setErro('Não foi possível carregar as pendências.');
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    useEffect(() => {
        const handler = () => {
            console.log('Evento nova-pendencia recebido, recarregando...');
            carregarDados();
        };
        window.addEventListener('nova-pendencia', handler);
        return () => window.removeEventListener('nova-pendencia', handler);
    }, [carregarDados]);

    const handleConcluir = async (pendencia) => {
        if (!window.confirm(`Concluir atendimento de ${pendencia.pcdAtendido?.nome}?`)) return;
        setProcessando(pendencia.id);
        try {
            await pendenciasService.concluirPendencia(pendencia.id); // ✅
            setPendencias(prev => prev.filter(p => p.id !== pendencia.id));
        } catch (err) {
            alert(getErrorMessage(err, 'Erro ao concluir atendimento.'));
        } finally {
            setProcessando(null);
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    Carregando pendências...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Pendências de Atendimento</h1>
                <p>
                    {pendencias.length === 0
                        ? 'Nenhuma pendência no momento.'
                        : `${pendencias.length} atendimento(s) pendente(s).`}
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
                            <th>Passageiro</th>
                            <th>Deficiência(s)</th>
                            <th>Suporte</th>
                            <th>Estação</th>
                            <th>Entrada</th>
                            <th>Horário</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendencias.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                    Nenhuma pendência encontrada.
                                </td>
                            </tr>
                        ) : (
                            pendencias.map(pendencia => (
                                <tr key={pendencia.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--cor-texto-forte)' }}>
                                        {pendencia.pcdAtendido?.nome ?? '—'}
                                    </td>
                                    <td>
                                        {Array.isArray(pendencia.pcdAtendido?.tiposDeficiencia)
                                            ? pendencia.pcdAtendido.tiposDeficiencia.map(t => (
                                                <span key={t} className="badge-info" style={{ marginRight: '4px' }}>
                                                    {t.charAt(0) + t.slice(1).toLowerCase()}
                                                </span>
                                            ))
                                            : <span className="badge-info">—</span>
                                        }
                                    </td>
                                    <td>{pendencia.pcdAtendido?.desejaSuporte ? 'Sim' : 'Não'}</td>
                                    <td>{pendencia.estacao?.nome ?? '—'}</td>
                                    <td>{pendencia.entrada?.codigoEntrada ?? '—'}</td>
                                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {pendencia.dataHora ? new Date(pendencia.dataHora).toLocaleTimeString() : '—'}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-approve"
                                            disabled={processando === pendencia.id}
                                            onClick={() => handleConcluir(pendencia)}
                                        >
                                            {processando === pendencia.id ? '...' : 'Concluir'}
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
};