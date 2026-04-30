import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { estacoesService } from '../services/estacoesService';
import '../../usuarios/pages/Cadastro.css';

export const EstacaoFormPage = () => {
  const navigate = useNavigate();
  const { codigoEstacao } = useParams();
  const isEdit = !!codigoEstacao;

  const [formData, setFormData] = useState({ nome: '', codigoEstacao: '', linhas: [] });
  const [loading, setLoading] = useState(false);

  const opcoesLinhas = [
    { id: 1, nome: 'AZUL' }, { id: 2, nome: 'VERDE' }, { id: 3, nome: 'VERMELHA' },
    { id: 4, nome: 'AMARELA' }, { id: 5, nome: 'LILAS' }, { id: 6, nome: 'LARANJA' },
    { id: 7, nome: 'RUBI' }, { id: 8, nome: 'DIAMANTE' }, { id: 9, nome: 'ESMERALDA' },
    { id: 10, nome: 'TURQUESA' }, { id: 11, nome: 'CORAL' }, { id: 12, nome: 'SAFIRA' },
    { id: 13, nome: 'JADE' }, { id: 14, nome: 'ONIX' }, { id: 15, nome: 'PRATA' }
  ];

  useEffect(() => {
    if (isEdit) {
      estacoesService.buscarPorCodigo(codigoEstacao).then(dados => {
        const linhasIds = dados.linhas.map(nome => opcoesLinhas.find(o => o.nome === nome)?.id).filter(id => id);
        setFormData({ nome: dados.nome, codigoEstacao: dados.codigoEstacao, linhas: linhasIds });
      });
    }
  }, [codigoEstacao]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await estacoesService.atualizar(codigoEstacao, formData);
      else await estacoesService.cadastrar(formData);
      navigate('/estacoes');
    } catch (err) { alert('Erro ao salvar estação.'); }
    finally { setLoading(false); }
  };

  const toggleLinha = (id) => {
    setFormData(prev => ({
      ...prev,
      linhas: prev.linhas.includes(id) ? prev.linhas.filter(l => l !== id) : [...prev.linhas, id]
    }));
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h2>{isEdit ? 'Editar Estação' : 'Nova Estação'}</h2>
          <p>{isEdit ? 'Atualize as informações da estação selecionada.' : 'Cadastre uma nova estação de metrô no sistema.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group">
              <label>Nome da Estação</label>
              <input 
                type="text" 
                value={formData.nome} 
                onChange={e => setFormData({...formData, nome: e.target.value})} 
                required 
                placeholder="Ex: Jabaquara"
              />
            </div>
            <div className="form-group">
              <label>Código Identificador</label>
              <input 
                type="text" 
                value={formData.codigoEstacao} 
                onChange={e => setFormData({...formData, codigoEstacao: e.target.value})} 
                required 
                disabled={isEdit} 
                placeholder="Ex: JAB"
              />
            </div>
            <div className="full form-group">
              <label>Linhas que atendem esta estação</label>
              <div className="checkbox-group">
                {opcoesLinhas.map(l => (
                  <label key={l.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={formData.linhas.includes(l.id)} 
                      onChange={() => toggleLinha(l.id)} 
                    /> {l.nome}
                  </label>
                ))}
              </div>
              <p className="form-hint">Selecione todas as linhas que passam por esta estação.</p>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/estacoes')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : 'Salvar Estação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};