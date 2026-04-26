import { httpClient } from '../../../core/api/httpClient';

export const tagsService = {
  listarTodas: async ( ) => {
    const response = await httpClient.get('/api/tag' );
    return response.data;
  },
  buscarPorCodigo: async (codigoTag) => {
    const response = await httpClient.get(`/api/tag/${codigoTag}` );
    return response.data;
  },
  cadastrar: async (dados) => {
    const response = await httpClient.post('/api/tag', dados );
    return response.data;
  },
  atualizar: async (codigoTag, dados) => {
    const response = await httpClient.put(`/api/tag/${codigoTag}`, dados );
    return response.data;
  },
  remover: async (codigoTag) => {
    await httpClient.delete(`/api/tag/${codigoTag}` );
  }
};
