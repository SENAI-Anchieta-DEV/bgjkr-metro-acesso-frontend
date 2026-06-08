import { httpClient } from '../../../core/api/httpClient';

export const pendenciasService = {
  listarPendenciasDoAgente: async (email) => {
    const response = await httpClient.get(`/api/pendencia-atendimento/agente/${email}`);
    return response.data;
  },

  concluirPendencia: async (id) => {
    await httpClient.delete(`/api/pendencia-atendimento/${id}`);
  },
};