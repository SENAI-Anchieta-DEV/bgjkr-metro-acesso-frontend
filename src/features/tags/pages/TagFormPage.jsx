import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tagsService } from '../services/tagsService';
import '../../usuarios/pages/Cadastro.css';

export const TagFormPage = () => {
  const navigate = useNavigate();
  const { codigoTag } = useParams();
  const isEdit = !!codigoTag;

  const [formData, setFormData] = useState({ codigoTag: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      tagsService.buscarPorCodigo(codigoTag).then(dados => {
        setFormData({ codigoTag: dados.codigoTag });
      });
    }
  }, [codigoTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await tagsService.atualizar(codigoTag, formData);
      else await tagsService.cadastrar(formData);
      navigate('/tags');
    } catch (err) { alert('Erro ao salvar tag. Verifique se o código já existe.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="gestao-container">
      <div className="table-container" style={{ padding: '30px', backgroundColor: 'var(--cor-fundo-card)' }}>
        <h2>{isEdit ? 'Editar Tag RFID' : 'Nova Tag RFID'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="full form-group">
              <label>Código Identificador (UID)</label>
              <input 
                type="text" 
                value={formData.codigoTag} 
                onChange={e => setFormData({ codigoTag: e.target.value })} 
                required 
                placeholder="Ex: E28011606000020A12345678"
              />
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px' }}>
                Este código deve corresponder ao identificador físico do dispositivo.
              </p>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/tags')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">Salvar Tag</button>
          </div>
        </form>
      </div>
    </div>
  );
};
