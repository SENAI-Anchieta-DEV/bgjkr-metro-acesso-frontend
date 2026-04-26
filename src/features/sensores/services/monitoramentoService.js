import { httpClient } from '../../../core/api/httpClient';

export const monitoramentoService = {
  
  // Buscar alertas de PCDs que entraram na estação e precisam de suporte
  buscarAlertas: async (codigoEstacao) => {
    const response = await httpClient.get(`/api/acessos/alertas/${codigoEstacao}`);
    return response.data;
  },

  // Buscar todos os acessos recentes (últimos 30 min) para o painel de presença
  buscarAcessosRecentes: async (codigoEstacao) => {
    const response = await httpClient.get(`/api/acessos/recentes/${codigoEstacao}`);
    return response.data;
  },

  // Marcar um atendimento como concluído
  concluirAtendimento: async (acessoId) => {
    const response = await httpClient.post(`/api/acessos/concluir/${acessoId}`);
    return response.data;
  }
};