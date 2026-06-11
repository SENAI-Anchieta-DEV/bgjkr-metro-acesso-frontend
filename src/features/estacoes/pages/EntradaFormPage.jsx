import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { entradasService } from '../services/entradasService';
import '../../usuarios/pages/Cadastro.css';

export const EntradaFormPage = () => {
  const navigate = useNavigate();
  const { codigoEstacao, codigoEntrada } = useParams();
  const isEdit = !!codigoEntrada;

  const [formData, setFormData] = useState({ codigoEntrada: '', bssid: '', codigoEstacao });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      entradasService.buscarPorCodigo(codigoEntrada).then(dados => {
        setFormData({ codigoEntrada: dados.codigoEntrada, bssid: dados.bssid, codigoEstacao });
      });
    }
  }, [codigoEntrada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await entradasService.atualizar(codigoEntrada, formData);
      else await entradasService.cadastrar(formData);
      navigate('/estacoes');
    } catch (err) {
      alert('Erro ao salvar entrada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h2>{isEdit ? 'Editar Entrada' : 'Nova Entrada'}</h2>
          <p>{isEdit ? 'Atualize as informações da entrada.' : `Cadastre uma nova entrada para a estação.`}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group">
              <label>Código da Entrada</label>
              <input
                type="text"
                value={formData.codigoEntrada}
                onChange={e => setFormData({ ...formData, codigoEntrada: e.target.value })}
                required
                placeholder="Ex: 123321"
              />
            </div>
            <div className="form-group">
              <label>BSSID do Roteador</label>
              <input
                type="text"
                value={formData.bssid}
                onChange={e => setFormData({ ...formData, bssid: e.target.value })}
                required
                placeholder="Ex: 26:0B:02:11:73:3F"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/estacoes')} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : 'Salvar Entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};