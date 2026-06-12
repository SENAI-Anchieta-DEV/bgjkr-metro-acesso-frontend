import { httpClient } from '../../../core/api/httpClient';

export const pcdService = {

  buscarPcdAtivo: async (email) => {
    const response = await httpClient.get(`/api/pcd/${email}`);
    return response.data;
  },

  atualizarPcd: async (email, dados) => {
    console.log('dados recebidos:', dados);
    const formData = new FormData();
    if (dados.nome) formData.append('nome', dados.nome);
    if (dados.email) formData.append('email', dados.email);
    if (dados.senha) formData.append('senha', dados.senha);
    if (dados.desejaSuporte !== undefined) formData.append('desejaSuporte', dados.desejaSuporte);
    if (dados.tiposDeficiencia) {
      dados.tiposDeficiencia.forEach(tipo => formData.append('tiposDeficiencia', tipo));
    }
    if (dados.comprovacao) formData.append('comprovacao', dados.comprovacao);

    console.log('formData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await httpClient.put(`/api/pcd/${email}`, formData);
    return response.data;
  },

  removerPcd: async (email) => {
    const response = await httpClient.delete(`/api/pcd/${email}`);
    return response.data;
  },

  buscarFormularioAtivo: async (email) => {
    const response = await httpClient.get(`/api/formulario/${email}`);
    return response.data;
  },
};