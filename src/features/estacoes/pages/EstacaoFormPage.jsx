import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { estacoesService } from '../services/estacoesService';
import '../../usuarios/pages/Cadastro.css';

export const EstacaoFormPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const isEdit = !!codigo;

  const [formData, setFormData] = useState({ nome: '', codigoEstacao: '', linhas: [] });
  const [loading, setLoading] = useState(false);

  const opcoesLinhas = [
    { id: 1, nome: 'AZUL' }, { id: 2, nome: 'VERDE' }, { id: 3, nome: 'VERMELHA' },
    { id: 4, nome: 'AMARELA' }, { id: 5, nome: 'LILAS' }, { id: 6, nome: 'LARANJA' }
    // Adicione as outras conforme o seu Enum Linha.java
  ];

  useEffect(() => {
    if (isEdit) {
      estacoesService.buscarPorCodigo(codigo).then(dados => {
        const linhasIds = dados.linhas.map(nome => opcoesLinhas.find(o => o.nome === nome)?.id).filter(id => id);
        setFormData({ nome: dados.nome, codigoEstacao: dados.codigoEstacao, linhas: linhasIds });
      });
    }
  }, [codigo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await estacoesService.atualizar(codigo, formData);
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
    <div className="gestao-container">
      <div className="table-container" style={{ padding: '30px', backgroundColor: 'var(--cor-fundo-card)' }}>
        <h2>{isEdit ? 'Editar Estação' : 'Nova Estação'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Código</label>
              <input type="text" value={formData.codigoEstacao} onChange={e => setFormData({...formData, codigoEstacao: e.target.value})} required disabled={isEdit} />
            </div>
            <div className="full form-group">
              <label>Linhas</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {opcoesLinhas.map(l => (
                  <label key={l.id}>
                    <input type="checkbox" checked={formData.linhas.includes(l.id)} onChange={() => toggleLinha(l.id)} /> {l.nome}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/estacoes')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
