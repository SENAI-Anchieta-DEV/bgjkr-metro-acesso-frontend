import { httpClient } from '../../../core/api/httpClient';

export const validacoesService = {
  buscarPendentes: async () => {
    const response = await httpClient.get('/api/formulario/pendentes');
    return response.data;
  },

  // Backend: POST /api/formulario/validar/{email}
  // Body: { aprovado: boolean, motivoReprovacao: string | null }
  processarValidacao: async (email, aprovado, motivoReprovacao, codigoTag = null) => {
    const response = await httpClient.post(`/api/formulario/validar/${email}`, {
      aprovado,
      motivoReprovacao: motivoReprovacao || null,
      codigoTag: codigoTag || null,
    });
    return response.data;
  },
};