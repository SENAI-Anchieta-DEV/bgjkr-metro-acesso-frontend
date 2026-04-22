import { httpClient } from '../../../core/api/httpClient';

export const validacoesService = {
  buscarPendentes: async () => {
    const response = await httpClient.get('/api/formulario/pendentes');
    return response.data;
  },

  // Backend: POST /api/formulario/validar/{email}
  // Body: { aprovado: boolean, motivoReprovacao: string | null }
  processarValidacao: async (email, aprovado, motivoReprovacao) => {
    const response = await httpClient.post(`/api/formulario/validar/${email}`, {
      aprovado,
      motivoReprovacao: motivoReprovacao || null,
    });
    return response.data;
  },
};