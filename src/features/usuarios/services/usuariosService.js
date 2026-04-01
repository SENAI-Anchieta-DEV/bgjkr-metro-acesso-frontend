import { httpClient } from '../../../core/api/httpClient';

export const usuariosService = {
  // Cadastra um novo Administrador
  cadastrarAdmin: async (dados) => {
    return await httpClient.post('/admin', dados);
  },

  // Cadastra um novo Agente de Atendimento
  cadastrarAgente: async (dados) => {
    return await httpClient.post('/agente', dados);
  },

  // O PcD geralmente vem via formulário, mas se o Admin cadastrar direto:
  cadastrarPcd: async (dados) => {
    return await httpClient.post('/pcd', dados);
  }
};