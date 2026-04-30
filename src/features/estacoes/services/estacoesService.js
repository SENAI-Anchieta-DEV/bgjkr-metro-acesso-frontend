import { httpClient } from '../../../core/api/httpClient';

export const estacoesService = {
  listarTodas: async ( ) => {
    const response = await httpClient.get('/api/estacao' );
    return response.data;
  },
  buscarPorCodigo: async (codigoEstacao) => {
    const response = await httpClient.get(`/api/estacao/${codigoEstacao}` );
    return response.data;
  },
  cadastrar: async (dados) => {
    const response = await httpClient.post('/api/estacao', dados );
    return response.data;
  },
  atualizar: async (codigoEstacao, dados) => {
    const response = await httpClient.put(`/api/estacao/${codigoEstacao}`, dados );
    return response.data;
  },
  remover: async (codigoEstacao) => {
    await httpClient.delete(`/api/estacao/${codigoEstacao}` );
  }
};
