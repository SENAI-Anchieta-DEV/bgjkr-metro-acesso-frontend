import { httpClient } from '../../../core/api/httpClient';

export const pcdService = {
  
  // Buscar dados do PCD logado pelo email
  buscarPcdAtivo: async (email) => {
    const response = await httpClient.get(`/api/pcd/${email}`);
    return response.data;
  },

  // Atualizar dados do PCD
  atualizarPcd: async (email, dados) => {
    const response = await httpClient.put(`/api/pcd/${email}`, dados);
    return response.data;
  },

  // Remover/desativar conta do PCD
  removerPcd: async (email) => {
    const response = await httpClient.delete(`/api/pcd/${email}`);
    return response.data;
  },

  // Buscar formulário ativo do PCD
  buscarFormularioAtivo: async (email) => {
    const response = await httpClient.get(`/api/formulario/${email}`);
    return response.data;
  },
};