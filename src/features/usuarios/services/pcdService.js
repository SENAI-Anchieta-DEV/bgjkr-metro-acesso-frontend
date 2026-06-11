import { httpClient } from '../../../core/api/httpClient';

export const pcdService = {

  // Buscar dados do PCD logado pelo email
  buscarPcdAtivo: async (email) => {
    const response = await httpClient.get(`/api/pcd/${email}`);
    return response.data;
  },

  // Atualizar dados do PCD
  atualizarPcd: async (email, dados) => {
    const formData = new FormData();
    if (dados.nome) formData.append('nome', dados.nome);
    if (dados.email) formData.append('email', dados.email);
    if (dados.senha) formData.append('senha', dados.senha);
    if (dados.desejaSuporte !== undefined) formData.append('desejaSuporte', dados.desejaSuporte);
    if (dados.tiposDeficiencia) {
      dados.tiposDeficiencia.forEach(tipo => formData.append('tiposDeficiencia', tipo));
    }

    const response = await httpClient.put(`/api/pcd/${email}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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